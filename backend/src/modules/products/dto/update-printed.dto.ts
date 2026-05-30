import { IsBoolean } from 'class-validator';

export class UpdatePrintedDto {
  @IsBoolean()
  printed: boolean;
}
