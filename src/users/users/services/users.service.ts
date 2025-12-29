import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/models/user.model';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { UpdateUserDTO } from 'src/users/dtos/update-user.dto';
import { PartialUpdateUserDTO } from 'src/users/dtos/partial-update-user.dto';
import { UserResponseDTO } from 'src/users/dtos/user-reponse.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserResponseDTO[]> {
    return (await this.repo.find())
      .map(User.fromEntity)
      .map(user => user.toResponseDTO());
  }

  async findOne(id: number): Promise<UserResponseDTO> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Usuario no encontrado');
    return User.fromEntity(entity).toResponseDTO();
  }

  async create(dto: CreateUserDTO): Promise<UserResponseDTO> {
    const saved = await this.repo.save(
      User.fromDto(dto).toEntity(),
    );
    return User.fromEntity(saved).toResponseDTO();
  }

  async update(id: number, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Usuario no encontrado');

    const saved = await this.repo.save(
      User.fromEntity(entity).update(dto).toEntity(),
    );

    return User.fromEntity(saved).toResponseDTO();
  }

  async partialUpdate(id: number, dto: PartialUpdateUserDTO): Promise<UserResponseDTO> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Usuario no encontrado');

    const saved = await this.repo.save(
      User.fromEntity(entity).partialUpdate(dto).toEntity(),
    );

    return User.fromEntity(saved).toResponseDTO();
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}
