import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Neo4jService } from 'nest-neo4j';

import { User } from './entity/user.entity';

import { GET_RECOMMENDED_USERS_QUERY } from './queries/recommendations.query';
import { TOGGLE_FOLLOW_USER_QUERY } from './queries/toggle-follow.query';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly neo4jService: Neo4jService,
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

  async getRecommendedUsers(currentUserId: string, page: number, size: number) {
    const internalLimit = size + 1; // To check if there is a next page
    const skip = (page - 1) * size;

    const result = await this.neo4jService.read(GET_RECOMMENDED_USERS_QUERY, {
      currentUserId,
      internalLimit: this.neo4jService.int(internalLimit),
      skip: this.neo4jService.int(Math.max(0, skip)),
    });

    const users = result.records.map((record) => {
      const user = record.get('user');
      return {
        ...user,
        mutualFollowersCount:
          typeof user.mutualFollowersCount === 'object'
            ? user.mutualFollowersCount.low
            : user.mutualFollowersCount,
      };
    });

    const hasNextPage = users.length > size;
    const data = hasNextPage ? users.slice(0, size) : users;

    return {
      data,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null,
    };
  }

  async toggleFollow(followerId: string, followedId: string) {
    if (followerId === followedId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const result = await this.neo4jService.write(TOGGLE_FOLLOW_USER_QUERY, {
      followerId,
      followedId,
    });

    if (result.records.length === 0) {
      throw new NotFoundException('User not found');
    }

    return { followed: result.records[0].get('followed') };
  }
}
