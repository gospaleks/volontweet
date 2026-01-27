import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Tweet } from '@/types/tweet.type';

import { Skeleton } from '@/components/ui/skeleton';

import { renderTweetContent } from './renderTweetContent';

type TweetContentProps = {
  tweet: Tweet;
  nonClickable?: boolean;
};

const TweetContent = ({ tweet, nonClickable = false }: TweetContentProps) => {
  const navigate = useNavigate();

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    if (nonClickable) return;

    const selection = window.getSelection()?.toString().trim();
    if (selection) return;
    navigate(`/tweets/${tweet.id}`);
  };

  return (
    <div
      className={`flex w-full ${nonClickable ? '' : 'cursor-pointer'} flex-col gap-1`}
      onClick={handleClick}
    >
      {/* Text content with hashtags and mentions */}
      <div className="text-base leading-relaxed wrap-break-word">
        {renderTweetContent(tweet)}
      </div>

      {/* Image preview */}
      {tweet.imageUrl && (
        <div className="relative h-96 w-full">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 rounded-4xl" />
          )}
          <img
            src={tweet.imageUrl}
            alt={`Tweet image for tweet ${tweet.id}`}
            className={`h-full w-fit rounded-4xl object-cover ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}
    </div>
  );
};

export default TweetContent;
