import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  InvitationStatus,
  NotificationType,
} from '@prisma/client';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Injectable()
export class InvitationsService {
  private readonly SALT_ROUNDS = 12;
  private readonly INVITATION_EXPIRY_DAYS = 7;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(invitedById: string, dto: CreateInvitationDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const pending = await this.prisma.invitation.findFirst({
      where: { email: dto.email, status: InvitationStatus.PENDING },
    });
    if (pending) {
      throw new ConflictException('A pending invitation already exists for this email');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.INVITATION_EXPIRY_DAYS);

    const invitation = await this.prisma.invitation.create({
      data: {
        email: dto.email,
        role: dto.role,
        token,
        invitedById,
        expiresAt,
      },
      include: {
        invitedBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    await this.notificationsService.createNotification({
      userId: invitedById,
      title: 'Invitation sent',
      message: `Invitation sent to ${dto.email} as ${dto.role}`,
      type: NotificationType.USER_INVITATION_SENT,
    });

    return invitation;
  }

  async findAll() {
    const invitations = await this.prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invitedBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    const now = new Date();
    const expiredIds: string[] = [];

    const data = invitations.map((inv) => {
      if (
        inv.status === InvitationStatus.PENDING &&
        inv.expiresAt < now
      ) {
        expiredIds.push(inv.id);
        return { ...inv, status: InvitationStatus.EXPIRED };
      }
      return inv;
    });

    if (expiredIds.length > 0) {
      await this.prisma.invitation.updateMany({
        where: { id: { in: expiredIds } },
        data: { status: InvitationStatus.EXPIRED },
      });
    }

    return data;
  }

  async revoke(id: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Only pending invitations can be revoked');
    }

    await this.prisma.invitation.delete({ where: { id } });
    return { message: 'Invitation revoked successfully' };
  }

  async accept(dto: AcceptInvitationDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token: dto.token },
    });

    if (!invitation) {
      throw new NotFoundException('Invalid invitation token');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Invitation is no longer valid');
    }

    if (invitation.expiresAt < new Date()) {
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      throw new BadRequestException('Invitation has expired');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: invitation.email },
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: invitation.email,
        password: hashedPassword,
        role: invitation.role,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED },
    });

    return { message: 'Invitation accepted successfully', user };
  }
}
