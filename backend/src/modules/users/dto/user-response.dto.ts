// DTO
import { Role } from '@prisma/client';

export class UserResponseDto {
  id: string;

  email: string;

  firstName: string | null;

  lastName: string | null;

  role: Role;

  createdAt: Date;

  updatedAt: Date;
}
