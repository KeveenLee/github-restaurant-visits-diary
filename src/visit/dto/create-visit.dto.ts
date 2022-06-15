import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateVisitDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  expense: number;

  @IsString()
  @IsNotEmpty()
  note: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  evaluation: number;
}
