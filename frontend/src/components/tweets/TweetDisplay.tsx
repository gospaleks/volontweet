import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import { formatRelativeDate } from '@/lib/utils';

import type { Mention, Tweet } from '@/types/tweet.type';

import { useToggleLikeTweetMutation } from '@/hooks/tweets/useToggleLikeTweet';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type TweetDisplayProps = {
  tweet: Tweet;
  onMentionHover?: (mention: Mention) => void;
  onHashtagClick?: (hashtag: string) => void;
  apiEndpoint?: string;
};

const TweetDisplay = ({
  tweet,
  onMentionHover,
  onHashtagClick,
  apiEndpoint,
}: TweetDisplayProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useToggleLikeTweetMutation(tweet.id);

  const user = tweet.author;
  const avatarFallback = user.firstName.charAt(0) + user.lastName.charAt(0);

  const handleToggleLike = () => {
    mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [apiEndpoint],
        });
      },
      onError: () => {
        toast.error('Failed to toggle like');
      },
    });
  };

  const renderTweetContent = useCallback(() => {
    const { content: raw, mentions } = tweet;

    const segments: React.ReactNode[] = [];

    let keyIndex = 0;

    const pushTextWithNewlines = (text: string) => {
      const parts = text.split('\n');

      parts.forEach((part, idx) => {
        if (part.length > 0) {
          segments.push(part);
        }

        if (idx < parts.length - 1) {
          segments.push(<br key={`nl-${keyIndex++}`} />);
        }
      });
    };

    let lastIndex = 0;

    // Sort mentions by start position
    const sortedMentions = [...mentions].sort((a, b) => a.start - b.start);

    sortedMentions.forEach((mention) => {
      // Add text before mention
      if (lastIndex < mention.start) {
        pushTextWithNewlines(raw.substring(lastIndex, mention.start));
      }

      // Add mention/hashtag with highlighting
      if (mention.type === '@') {
        segments.push(
          <span
            key={`${mention.type}-${mention.start}`}
            className="text-primary cursor-pointer font-semibold underline-offset-4 hover:underline"
            onMouseEnter={() => onMentionHover?.(mention)}
          >
            @{mention.value}
          </span>,
        );
      } else {
        segments.push(
          <span
            key={`${mention.type}-${mention.start}`}
            className="text-primary cursor-pointer font-semibold underline-offset-4 hover:underline"
            onClick={() => onHashtagClick?.(mention.value)}
          >
            #{mention.value}
          </span>,
        );
      }

      lastIndex = mention.end;
    });

    // Add remaining text
    if (lastIndex < raw.length) {
      pushTextWithNewlines(raw.substring(lastIndex));
    }

    return segments;
  }, [onHashtagClick, onMentionHover, tweet]);

  return (
    <div className="flex gap-4 border-b p-4">
      <Link to={`/users/${user.username}`}>
        <Avatar className="size-11 shrink-0">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex w-full flex-col gap-1">
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

        <div className="text-base leading-relaxed wrap-break-word">
          {renderTweetContent()}
        </div>

        <div className="ml-auto flex items-center">
          <Tooltip delay={500}>
            <TooltipTrigger className="group flex items-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleToggleLike}
                disabled={isPending}
              >
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  fill={tweet.stats.isLikedByMe ? 'currentColor' : 'none'}
                />
              </Button>
              {tweet.stats.likesCount}
            </TooltipTrigger>
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
