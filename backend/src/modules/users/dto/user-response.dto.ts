// DTO
import { Role } from '@prisma/client';

export class UserResponseDto {
  id: string;

  email: string;

  firstName: string | null;

  lastName: string | null;

  role: Role;

  isActive: boolean;

  lastLoginAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
