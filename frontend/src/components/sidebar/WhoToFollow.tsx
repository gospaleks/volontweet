import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserAdd01Icon, UserMultiple02Icon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';
import { API_ENDPOINTS } from '@/config/endpoints';

import type { UserDetails } from '@/types/user.types';

import type { InfiniteResponse } from '@/types/infiniteResponse.type';

import { buttonVariants } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import H4 from '@/components/ui/typography/H4';

import RecommendedUser from '@/components/RecommendedUser/RecommendedUser';
import RecommendedUserSkeleton from '@/components/RecommendedUser/RecommendedUserSkeleton';

const WhoToFollow = () => {
  const { data: users, isLoading } = useQuery<InfiniteResponse<UserDetails>>({
    queryKey: [API_ENDPOINTS.USER_RECOMMENDATIONS, { page: 1, size: 5 }],
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={UserAdd01Icon} />
        <H4>Who to follow</H4>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-5">
          {[...Array(5)].map((_, index) => (
            <RecommendedUserSkeleton key={index} />
          ))}

          <Skeleton className="m-2.5 h-4 w-16 rounded-4xl" />
        </div>
      ) : users && users.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {users.data.map((user) => (
            <RecommendedUser key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={UserMultiple02Icon} />
            </EmptyMedia>
            <EmptyTitle>No recommended users at the moment</EmptyTitle>
            <EmptyDescription>
              Follow more users to get better recommendations.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {users && users.data.length > 0 && (
        <Link
          to="/users"
          className={cn(buttonVariants({ variant: 'link' }), 'w-fit')}
        >
          Show more
        </Link>
      )}
    </div>
  );
};

export default WhoToFollow;
