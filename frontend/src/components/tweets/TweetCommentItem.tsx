import { Link } from 'react-router-dom';

import { formatRelativeDate, getUserFullName } from '@/lib/utils';

import type { Comment } from '@/types/comment.types';

import TweetCommentDropdownMenu from './TweetCommentDropdownMenu';
import UserAvatar from '../common/UserAvatar';

type TweetCommentItemProps = {
  comment: Comment;
  tweetId: string;
};

const TweetCommentItem = ({ comment, tweetId }: TweetCommentItemProps) => {
  const author = comment.author;

  return (
    <div className="flex gap-4 border-b p-4">
      <Link to={`/users/${author.username}`}>
        <UserAvatar
          user={author}
          avatarSize="size-11"
          onlineStatusSize="size-3"
        />
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
