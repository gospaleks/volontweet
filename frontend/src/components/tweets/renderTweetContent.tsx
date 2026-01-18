import { Link } from 'react-router-dom';

import type { Tweet } from '@/types/tweet.type';

export const renderTweetContent = (tweet: Tweet) => {
  const { content: rawContent, mentions } = tweet;

  const raw = rawContent.replace(/\r\n/g, '\n');

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
        <Link
          to={`/users/${mention.value}`}
          key={`${mention.type}-${mention.start}`}
          className="text-primary cursor-pointer font-semibold underline-offset-4 hover:underline"
        >
          @{mention.value}
        </Link>,
      );
    } else {
      segments.push(
        <span
          key={`${mention.type}-${mention.start}`}
          className="text-primary cursor-pointer font-semibold underline-offset-4 hover:underline"
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
};
