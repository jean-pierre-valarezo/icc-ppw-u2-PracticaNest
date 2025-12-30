import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-update-product.dto';


@Controller('products')
export class ProductsController {

  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

@Post()
create(@Body() dto: CreateProductDto) {
  return this.service.create(dto);
}

@Put(':id')
update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
  return this.service.update(+id, dto);
}

@Patch(':id')
partialUpdate(
  @Param('id') id: string,
  @Body() dto: PartialUpdateProductDto,
) {
  return this.service.partialUpdate(+id, dto);
}


 @Delete(':id')
delete(@Param('id') id: string) {
  return this.service.delete(+id);
}

}
