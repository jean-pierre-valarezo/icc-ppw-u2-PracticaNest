import { IsNotEmpty, MinLength, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateProductDto {

  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsOptional()
  @MinLength(3)
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}
