import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Neo4jService } from 'nest-neo4j';

import { transformNeo4jTypes } from 'src/common/utils/neo4j-utils';

import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

import { GET_RECOMMENDED_USERS_QUERY } from './queries/recommendations.query';
import { TOGGLE_FOLLOW_USER_QUERY } from './queries/toggle-follow.query';
import { GET_USER_DETAILS_QUERY } from './queries/get-user-details.query';
import { GET_USER_FOLLOWERS_QUERY } from './queries/get-followers.query';
import { GET_USER_FOLLOWING_QUERY } from './queries/get-following.query';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly neo4jService: Neo4jService,
  ) {}

  async getUsersConnections(
    currentUserId: string,
    username: string,
    page: number,
    size: number,
    type: 'followers' | 'following',
  ) {
    const internalLimit = size + 1;
    const skip = (page - 1) * size;

    const result = await this.neo4jService.read(
      type === 'followers'
        ? GET_USER_FOLLOWERS_QUERY
        : GET_USER_FOLLOWING_QUERY,
      {
        currentUserId,
        username,
        skip: this.neo4jService.int(skip),
        internalLimit: this.neo4jService.int(internalLimit),
      },
    );

    return this.processUserPagination(result.records, size, page);
  }

  async getUserByUsername(currentUserId: string, username: string) {
    const result = await this.neo4jService.read(GET_USER_DETAILS_QUERY, {
      username,
      currentUserId,
    });

    if (result.records.length === 0) {
      throw new NotFoundException('User not found');
    }

    const user = result.records[0].get('user');

    return transformNeo4jTypes(user);
  }

  async updateUserInfo(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldPostgresData = {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
    };

    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);

    try {
      await this.neo4jService.write(
        /* cypher */ `
        MATCH (u:User {id: $userId})
        SET u += $props
        RETURN u
        `,
        {
          userId,
          props: updateUserDto,
        },
      );
    } catch (error) {
      await this.userRepository.save({
        ...user,
        ...oldPostgresData,
      });

      throw error;
    }

    return updatedUser;
  }

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
    const internalLimit = size + 1;
    const skip = (page - 1) * size;

    const result = await this.neo4jService.read(GET_RECOMMENDED_USERS_QUERY, {
      currentUserId,
      internalLimit: this.neo4jService.int(internalLimit),
      skip: this.neo4jService.int(Math.max(0, skip)),
    });

    return this.processUserPagination(result.records, size, page);
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

  private processUserPagination(records: any[], size: number, page: number) {
    const hasNextPage = records.length > size;
    const data = hasNextPage ? records.slice(0, size) : records;

    const mappedData = data.map((record) => {
      const user = record.get('user');

      return transformNeo4jTypes(user);
    });

    return {
      data: mappedData,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null,
    };
  }
}
