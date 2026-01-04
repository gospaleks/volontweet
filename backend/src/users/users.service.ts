import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsersSuggestions(limit: number, search: string) {
    return this.userRepository.find({
      where: {
        username: ILike(`%${search}%`),
      },
      take: limit,
      order: {
        username: 'ASC',
      },
      select: ['id', 'email', 'username', 'firstName', 'lastName'],
    });
  }
}
