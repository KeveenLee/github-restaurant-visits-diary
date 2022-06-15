import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateVisitDto {
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsNumber()
  @IsOptional()
  expense?: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  evaluation?: number;
}
