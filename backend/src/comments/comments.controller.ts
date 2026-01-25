import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CreateCommentDto } from './dto/create-comment.dto';

import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':tweetId')
  createComment(
    @Param('tweetId') tweetId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as JwtPayload;
    return this.commentsService.createComment(
      tweetId,
      user.sub,
      createCommentDto,
    );
  }

  @Delete(':commentId')
  deleteComment(@Param('commentId') commentId: string, @Req() req: Request) {
    const user = req['user'] as JwtPayload;
    return this.commentsService.deleteComment(commentId, user.sub);
  }

  @Get(':tweetId')
  getComments(
    @Req() req: Request,
    @Param('tweetId') tweetId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const user = req['user'] as JwtPayload;
    return this.commentsService.getComments(tweetId, user.sub, page, size);
  }
}
