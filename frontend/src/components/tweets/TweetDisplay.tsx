import { Card, CardContent, CardHeader } from '@/components/ui/card';

import type { Mention, Tweet } from '@/types/tweet.type';

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
  const renderTweetContent = () => {
    const { content: raw, mentions } = tweet;

    const segments: React.ReactNode[] = [];

    let lastIndex = 0;

    // Sort mentions by start position
    const sortedMentions = [...mentions].sort((a, b) => a.start - b.start);

    sortedMentions.forEach((mention) => {
      // Add text before mention
      if (lastIndex < mention.start) {
        segments.push(raw.substring(lastIndex, mention.start));
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
      segments.push(raw.substring(lastIndex));
    }

    return segments;
  };

  return (
    <Card>
      {tweet.author && (
        <CardHeader className="flex items-center gap-3">
          <div>
            <div className="text-sm font-semibold">
              {tweet.author.firstName} {tweet.author.lastName}
            </div>
            <div className="text-muted-foreground text-xs">
              @{tweet.author.username}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="text-base leading-relaxed wrap-break-word">
        {renderTweetContent()}
      </CardContent>
    </Card>
  );
};

export default TweetDisplay;
