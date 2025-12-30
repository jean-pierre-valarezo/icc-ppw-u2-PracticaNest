import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';

export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: string | undefined,
    public price: number,
    public stock: number,
    public createdAt: Date,
  ) {}

  static fromDto(dto: CreateProductDto): Product {
    return new Product(
      0,
      dto.name,
      dto.description,
      dto.price,
      dto.stock ?? 0,
      new Date(),
    );
  }

  static fromEntity(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.description ?? undefined,
      Number(entity.price),
      entity.stock,
      entity.createdAt,
    );
  }

  toEntity(): ProductEntity {
    const entity = new ProductEntity();
    if (this.id > 0) entity.id = this.id;
    entity.name = this.name; 
    entity.description = this.description ?? null;

    entity.price = this.price;
    entity.stock = this.stock;
    return entity;
  }

  toResponseDto(): ProductResponseDto {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      createdAt: (this.createdAt ?? new Date()).toISOString(),
    };
  }

  update(dto: UpdateProductDto): Product {
    this.name = dto.name;
    this.description = dto.description;
    this.price = dto.price;
    this.stock = dto.stock;
    return this;
  }

  partialUpdate(dto: PartialUpdateProductDto): Product {
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.description !== undefined) this.description = dto.description;
    if (dto.price !== undefined) this.price = dto.price;
    if (dto.stock !== undefined) this.stock = dto.stock;
    return this;
  }
}
