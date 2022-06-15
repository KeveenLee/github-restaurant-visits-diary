import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  place?: string;

  @IsString()
  @IsOptional()
  cuisineType?: string;
}
