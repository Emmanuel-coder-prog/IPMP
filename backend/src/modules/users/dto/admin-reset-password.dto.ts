import { IsString, MinLength } from 'class-validator';

export class AdminResetPasswordDto {
  @IsString()
  @MinLength(1)
  adminPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
