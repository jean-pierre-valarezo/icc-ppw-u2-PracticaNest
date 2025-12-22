import { Body, Controller, Get, Post, Put, Patch, Delete, Param, NotFoundException, } from "@nestjs/common";

import { Product } from "../entities/product.entity";
import { ProductMapper } from "../mappers/product.mapper";
import { CreateProductDTO } from "../dtos/create-product.dto";
import { UpdateProductDTO } from "../dtos/update-product.dto";
import { PartialUpdateProductDTO } from "../dtos/partial-update-product.dto";

@Controller('products')
export class ProductsController {
  private products: Product[] = [];
  private currentId = 1;

  // GET /api/products
  @Get()
  findAll() {
    return this.products.map(p =>
      ProductMapper.toResponseDTO(p)
    );
  }

  // GET /api/products/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    const product = this.products.find(p => p.id === Number(id));
    if (!product)
      throw new NotFoundException('Producto no encontrado');

    return ProductMapper.toResponseDTO(product);
  }

  // POST /api/products
  @Post()
  create(@Body() dto: CreateProductDTO) {
    const entity = ProductMapper.toEntity(this.currentId++, dto);
    this.products.push(entity);
    return ProductMapper.toResponseDTO(entity);
  }

  // PUT /api/products/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDTO) {
    const index = this.products.findIndex(p => p.id === Number(id));
    if (index === -1)
      throw new NotFoundException('Producto no encontrado');

    const updated = new Product(
      Number(id),
      dto.name,
      dto.price,
      dto.stock,
    );

    this.products[index] = updated;
    return ProductMapper.toResponseDTO(updated);
  }

  // PATCH /api/products/:id
  @Patch(':id')
  partialUpdate(
    @Param('id') id: string,
    @Body() dto: PartialUpdateProductDTO,
  ) {
    const product = this.products.find(p => p.id === Number(id));
    if (!product)
      throw new NotFoundException('Producto no encontrado');

    product.name = dto.name ?? product.name;
    product.price = dto.price ?? product.price;
    product.stock = dto.stock ?? product.stock;

    return ProductMapper.toResponseDTO(product);
  }

  // DELETE /api/products/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    const index = this.products.findIndex(p => p.id === Number(id));
    if (index === -1)
      throw new NotFoundException('Producto no encontrado');

    this.products.splice(index, 1);
    return { message: 'Producto eliminado correctamente' };
  }
}
