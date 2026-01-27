import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon } from '@hugeicons/core-free-icons';

import { formatRelativeDate, getAvatarFallback } from '@/lib/utils';

import type { Tweet } from '@/types/tweet.type';

import { useToggleLikeTweetMutation } from '@/hooks/tweets/useToggleLikeTweet';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import TweetDropdownMenu from './TweetDropdownMenu';
import TweetContent from './TweetContent';

type TweetDisplayProps = {
  tweet: Tweet;
  apiEndpoint: string;
  nonClickable?: boolean;
};

const TweetDisplay = ({
  tweet,
  apiEndpoint,
  nonClickable = false,
}: TweetDisplayProps) => {
  const { mutate, isPending } = useToggleLikeTweetMutation(
    tweet.id,
    apiEndpoint,
    nonClickable,
  );

  const user = tweet.author;

  const handleToggleLike = () => {
    mutate();
  };

  return (
    <div className="flex gap-4 border-b p-4">
      <Link to={`/users/${user.username}`}>
        <Avatar className="size-11 shrink-0">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex w-full flex-col gap-1">
        {/* User info and relative timestamp */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to={`/users/${user.username}`}
            className="group flex items-center gap-2"
          >
            <span className="font-semibold underline-offset-4 group-hover:underline">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-muted-foreground text-sm">
              @{user.username}
            </span>
            <span>·</span>
            <span className="text-muted-foreground text-sm">
              {formatRelativeDate(tweet.createdAt)}
            </span>
          </Link>

          <TweetDropdownMenu tweet={tweet} apiEndpoint={apiEndpoint} />
        </div>

        <TweetContent tweet={tweet} nonClickable={nonClickable} />

        {/* Actions */}
        <div className="ml-auto flex items-center">
          <Tooltip delay={500}>
            <TooltipTrigger
              render={
                <div className="group flex items-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleToggleLike}
                    disabled={isPending}
                  >
                    <HugeiconsIcon
                      icon={FavouriteIcon}
                      fill={tweet.stats.isLikedByMe ? 'currentColor' : 'none'}
                      color={
                        tweet.stats.isLikedByMe ? '#f91880' : 'currentColor'
                      }
                    />
                  </Button>
                  <span
                    style={{
                      color: tweet.stats.isLikedByMe ? '#f91880' : undefined,
                    }}
                    className="-ml-1"
                  >
                    {tweet.stats.likesCount}
                  </span>
                </div>
              }
            />
            <TooltipContent side="bottom">
              {tweet.stats.isLikedByMe ? 'Unlike' : 'Like'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default TweetDisplay;
