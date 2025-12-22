import { Injectable, NotFoundException } from '@nestjs/common';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { UpdateUserDTO } from 'src/users/dtos/update-user.dto';
import { PartialUpdateUserDTO } from 'src/users/dtos/partial-update-user.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {

  private users: User[] = [];
  private currentId = 1;

  findAll() {
    return this.users.map(user =>
      UserMapper.toResponseDTO(user),
    );
  }

  findOne(id: number) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return UserMapper.toResponseDTO(user);
  }

  create(dto: CreateUserDTO) {
    const entity = UserMapper.toEntity(this.currentId++, dto);
    this.users.push(entity);
    return UserMapper.toResponseDTO(entity);
  }

  update(id: number, dto: UpdateUserDTO) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.name = dto.name;
    user.email = dto.email;
    user.password = dto.password;

    return UserMapper.toResponseDTO(user);
  }

  partialUpdate(id: number, dto: PartialUpdateUserDTO) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.name = dto.name ?? user.name;
    user.email = dto.email ?? user.email;
    user.password = dto.password ?? user.password;

    return UserMapper.toResponseDTO(user);
  }

  remove(id: number) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new NotFoundException('Usuario no encontrado');
    }

    this.users.splice(index, 1);
    return { message: 'Usuario eliminado correctamente' };
  }
}
