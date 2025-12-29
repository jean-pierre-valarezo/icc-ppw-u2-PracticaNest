/*
import { Product } from "../entities/product.entity";
import { CreateProductDTO } from "../dtos/create-product.dto";

export class ProductMapper {
  static toEntity(id: number, dto: CreateProductDTO): Product {
    return new Product(id, dto.name, dto.price, dto.stock);
  }

  static toResponseDTO(entity: Product) {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      stock: entity.stock,
    };
  }
}
*/