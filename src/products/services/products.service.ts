import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/product.model';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { UpdateProductDTO } from '../dtos/update-product.dto';
import { PartialUpdateProductDTO } from '../dtos/partial-update-product.dto';
import { ProductResponseDTO } from '../dtos/product-response.dto';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductResponseDTO[]> {
    return (await this.productRepository.find())
      .map(Product.fromEntity)
      .map(p => p.toResponseDTO());
  }

  async findOne(id: number): Promise<ProductResponseDTO> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return Product.fromEntity(entity).toResponseDTO();
  }

  async create(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    const product = Product.fromDto(dto);
    const saved = await this.productRepository.save(product.toEntity());

    return Product.fromEntity(saved).toResponseDTO();
  }

  async update(id: number, dto: UpdateProductDTO): Promise<ProductResponseDTO> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updated = Product.fromEntity(entity)
      .update(dto)
      .toEntity();

    const saved = await this.productRepository.save(updated);

    return Product.fromEntity(saved).toResponseDTO();
  }

  async partialUpdate(
    id: number,
    dto: PartialUpdateProductDTO,
  ): Promise<ProductResponseDTO> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updated = Product.fromEntity(entity)
      .partialUpdate(dto)
      .toEntity();

    const saved = await this.productRepository.save(updated);

    return Product.fromEntity(saved).toResponseDTO();
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
