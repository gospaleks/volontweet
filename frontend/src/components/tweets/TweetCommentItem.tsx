import { Link } from 'react-router-dom';

import {
  formatRelativeDate,
  getAvatarFallback,
  getUserFullName,
} from '@/lib/utils';

import type { Comment } from '@/types/comment.types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TweetCommentDropdownMenu from './TweetCommentDropdownMenu';

type TweetCommentItemProps = {
  comment: Comment;
  tweetId: string;
};

const TweetCommentItem = ({ comment, tweetId }: TweetCommentItemProps) => {
  const author = comment.author;

  return (
    <div className="flex gap-4 border-b p-4">
      <Link to={`/users/${author.username}`}>
        <Avatar className="size-11 shrink-0">
          <AvatarImage src={author.avatarUrl} />
          <AvatarFallback>{getAvatarFallback(author)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex w-full flex-col gap-1">
        {/* User info and relative timestamp */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to={`/users/${author.username}`}
            className="group flex items-center gap-2"
          >
            <span className="font-semibold underline-offset-4 group-hover:underline">
              {getUserFullName(author)}
            </span>
            <span className="text-muted-foreground text-sm">
              @{author.username}
            </span>
            <span>·</span>
            <span className="text-muted-foreground text-sm">
              {formatRelativeDate(comment.createdAt)}
            </span>
          </Link>

          <TweetCommentDropdownMenu comment={comment} tweetId={tweetId} />
        </div>

        <p className="whitespace-pre-line">{comment.content}</p>
      </div>
    </div>
  );
};

export default TweetCommentItem;
