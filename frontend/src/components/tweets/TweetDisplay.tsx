import { useCallback } from 'react';

import { formatRelativeDate } from '@/lib/utils';

import type { Mention, Tweet } from '@/types/tweet.type';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type TweetDisplayProps = {
  tweet: Tweet;
  onMentionHover?: (mention: Mention) => void;
  onHashtagClick?: (hashtag: string) => void;
};

const TweetDisplay = ({
  tweet,
  onMentionHover,
  onHashtagClick,
}: TweetDisplayProps) => {
  const user = tweet.author;
  const avatarFallback = user.firstName.charAt(0) + user.lastName.charAt(0);

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
      <Avatar className="size-11 shrink-0">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>

      <div className="flex w-full flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-muted-foreground text-sm">
            @{user.username}
          </span>
          <span>·</span>
          <span className="text-muted-foreground text-sm">
            {formatRelativeDate(tweet.createdAt)}
          </span>
        </div>

        <div className="text-base leading-relaxed wrap-break-word">
          {renderTweetContent()}
        </div>
      </div>
    </div>
  );
};

export default TweetDisplay;
