// #region @imports
// NODE IMPORTS
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// PROJECT IMPORTS
import { UserEntity } from './entities/user.entity';
import { CreateUserInterface } from './interfaces/create.interface';
import { UpdateUserInterface } from './interfaces/update.interface';
// #endregion

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async create(dto: CreateUserInterface): Promise<UserEntity> {
    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({ ...dto, password: hash });
    return this.userRepository.save(user);
  }

  public async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  public async findOneById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { $id: id } });
  }

  public async update(
    id: string,
    dto: UpdateUserInterface,
  ): Promise<UserEntity> {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException();
    return this.userRepository.save({ ...user, ...dto });
  }
}
