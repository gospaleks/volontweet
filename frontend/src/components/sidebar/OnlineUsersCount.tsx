import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import { Skeleton } from '@/components/ui/skeleton';
import H4 from '@/components/ui/typography/H4';

const OnlineUsersCount = () => {
  const { data, isLoading } = useQuery<{ count: number }>({
    queryKey: [API_ENDPOINTS.ONLINE_USERS_COUNT],
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <span className="ring-background bg-primary size-4 rounded-full ring-2" />
        <H4>
          {isLoading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            `${data?.count || 0} online user${data?.count === 1 ? '' : 's'}`
          )}
        </H4>
      </div>
    </div>
  );
};

export default OnlineUsersCount;
