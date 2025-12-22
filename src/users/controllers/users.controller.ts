import { Body, Controller, Get, Param, Patch, Post, Put, Delete, } from "@nestjs/common";

import { UsersService } from "../users/services/users.service";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { UpdateUserDTO } from "../dtos/update-user.dto";
import { PartialUpdateUserDTO } from "../dtos/partial-update-user.dto";

@Controller('users') 
export class UsersController {

  constructor(private readonly service: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateUserDTO) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    return this.service.update(Number(id), dto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id') id: string,
    @Body() dto: PartialUpdateUserDTO,
  ) {
    return this.service.partialUpdate(Number(id), dto);
  }

  @Delete(':id')
delete(@Param('id') id: string) {
  return this.service.delete(Number(id));
}

}
