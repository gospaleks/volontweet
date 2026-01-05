import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Neo4jService } from 'nest-neo4j';

import { User } from './entity/user.entity';

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

    const query = `
      MATCH (me:User {id: $currentUserId})

      // 1. Strategy: Friends of my friends
      OPTIONAL MATCH (me)-[:FOLLOWS]->(friend)-[:FOLLOWS]->(suggested:User)
      WHERE NOT (me)-[:FOLLOWS]->(suggested) AND suggested <> me

      // 2. Strategy: Globally popular (for Cold Start)
      WITH me, suggested, count(friend) as mutualCount
      CALL {
          WITH me
          MATCH (popular:User)
          WHERE NOT (me)-[:FOLLOWS]->(popular) AND popular <> me
          OPTIONAL MATCH (popular)<-[:FOLLOWS]-(follower)
          RETURN popular, count(follower) as followerCount
          ORDER BY followerCount DESC
          LIMIT 20
      }

      // Merging results from both strategies
      WITH me, 
           coalesce(suggested, popular) AS user, 
           coalesce(mutualCount, 0) AS weight
      WHERE user IS NOT NULL

      // First, perform DISTINCT and sorting while we still have access to the 'weight' variable
      WITH DISTINCT user, weight
      ORDER BY weight DESC
      SKIP $skip
      LIMIT $internalLimit

      RETURN user {
          .id,
          .username,
          .firstName,
          .lastName,
          .avatarUrl,
          mutualFriendsCount: weight
      } AS user
    `;

    const result = await this.neo4jService.read(query, {
      currentUserId,
      internalLimit: this.neo4jService.int(internalLimit),
      skip: this.neo4jService.int(Math.max(0, skip)),
    });

    const users = result.records.map((record) => {
      const user = record.get('user');
      return {
        ...user,
        mutualFriendsCount:
          typeof user.mutualFriendsCount === 'object'
            ? user.mutualFriendsCount.low
            : user.mutualFriendsCount,
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

    const query = `
      MATCH (me:User {id: $followerId})
      MATCH (target:User {id: $followedId})
      
      OPTIONAL MATCH (me)-[r:FOLLOWS]->(target)
      
      FOREACH (_ IN CASE WHEN r IS NOT NULL THEN [1] ELSE [] END |
        DELETE r
      )
      FOREACH (_ IN CASE WHEN r IS NULL THEN [1] ELSE [] END |
        CREATE (me)-[:FOLLOWS]->(target)
      )
      
      RETURN r IS NULL as followed
    `;

    const result = await this.neo4jService.write(query, {
      followerId,
      followedId,
    });

    if (result.records.length === 0) {
      throw new NotFoundException('User not found');
    }

    return { followed: result.records[0].get('followed') };
  }
}
