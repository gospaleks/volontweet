import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { HashtagIcon } from '@hugeicons/core-free-icons';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Hashtag } from '@/types/hashtag.type';

import H4 from '@/components/ui/typography/H4';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import EmptyState from '@/components/EmptyState';

const TrendingHashtags = () => {
  const { data: hashtags, isLoading } = useQuery<Hashtag[]>({
    queryKey: [
      API_ENDPOINTS.TRENDING_HASHTAGS,
      {
        limit: 10,
      },
    ],
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={HashtagIcon} />
        <H4>Trending topics</H4>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {[...Array(10)].map((_, index) => {
            const widths = ['w-12', 'w-16', 'w-20', 'w-24', 'w-28'];
            const widthClass = widths[index % widths.length];
            return (
              <Skeleton
                key={index}
                className={`h-4 ${widthClass} rounded-4xl`}
              />
            );
          })}
        </div>
      ) : hashtags && hashtags.length === 0 ? (
        <EmptyState
          title="No trending topics"
          description="There are no trending topics at the moment. Come back later."
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {hashtags?.map((hashtag) => (
            <Link to={`/hashtags/${hashtag.tag}`} key={hashtag.tag}>
              <Badge
                variant="secondary"
                className="hover:border-foreground cursor-pointer transition-all"
              >
                <span className="text-foreground/70">#</span>
                <span>{hashtag.tag}</span>
                <span className="text-foreground/50">· {hashtag.count}</span>
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingHashtags;
