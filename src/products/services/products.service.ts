import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { NotFoundException } from 'src/exceptions/domain/not-found.exception';
import { ConflictException } from 'src/exceptions/domain/conflict.exception';
import { BadRequestException } from 'src/exceptions/domain/bad-request.exception';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}


  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.find();

    return entities
      .map(Product.fromEntity)
      .map(product => product.toResponseDto());
  }


  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(
        `Producto no encontrado con ID: ${id}`,
      );
    }

    return Product.fromEntity(entity).toResponseDto();
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const exists = await this.productRepository.exist({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException(
        `Ya existe un producto con nombre: ${dto.name}`,
      );
    }


    if (dto.price < 0) {
      throw new BadRequestException(
        'El precio no puede ser negativo',
      );
    }

    const product = Product.fromDto(dto);
    const saved = await this.productRepository.save(
      product.toEntity(),
    );

    return Product.fromEntity(saved).toResponseDto();
  }

  async update(
    id: number,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {

    const entity = await this.productRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(
        `Producto no encontrado con ID: ${id}`,
      );
    }

    if (dto.price < 0) {
      throw new BadRequestException(
        'El precio no puede ser negativo',
      );
    }

    const updated = Product.fromEntity(entity)
      .update(dto)
      .toEntity();

    const saved = await this.productRepository.save(updated);

    return Product.fromEntity(saved).toResponseDto();
  }

  async partialUpdate(
    id: number,
    dto: PartialUpdateProductDto,
  ): Promise<ProductResponseDto> {

    const entity = await this.productRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(
        `Producto no encontrado con ID: ${id}`,
      );
    }

    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException(
        'El precio no puede ser negativo',
      );
    }

    const updated = Product.fromEntity(entity)
      .partialUpdate(dto)
      .toEntity();

    const saved = await this.productRepository.save(updated);

    return Product.fromEntity(saved).toResponseDto();
  }


  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Producto no encontrado con ID: ${id}`,
      );
    }
  }
}
