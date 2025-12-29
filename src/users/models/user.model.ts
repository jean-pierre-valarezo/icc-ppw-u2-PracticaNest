import { UserEntity } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { PartialUpdateUserDTO } from '../dtos/partial-update-user.dto';
import { UserResponseDTO } from '../dtos/user-reponse.dto';

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public createdAt: Date,
  ) {}

  // ========= FACTORY METHODS =========

  static fromDto(dto: CreateUserDTO): User {
    return new User(
      0,
      dto.name,
      dto.email,
      dto.password,
      new Date(),
    );
  }

  static fromEntity(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.createdAt,
    );
  }

  // ========= CONVERSIONS =========

  toEntity(): UserEntity {
    const entity = new UserEntity();
    if (this.id > 0) {
      entity.id = this.id;
    }
    entity.name = this.name;
    entity.email = this.email;
    entity.password = this.password;
    return entity;
  }

  toResponseDTO(): UserResponseDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
    };
  }

  update(dto: UpdateUserDTO): User {
    this.name = dto.name;
    this.email = dto.email;
    if (dto.password) this.password = dto.password;
    return this;
  }

  partialUpdate(dto: PartialUpdateUserDTO): User {
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.email !== undefined) this.email = dto.email;
    if (dto.password !== undefined) this.password = dto.password;
    return this;
  }
}
