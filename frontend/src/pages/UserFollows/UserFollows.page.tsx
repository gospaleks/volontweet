import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { UserDetails } from '@/types/user.types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import type { InfiniteResponse } from '@/types/infiniteResponse.type';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Spinner } from '@/components/ui/spinner';
import RecommendedUser from '@/components/RecommendedUser/RecommendedUser';

const UserFollowsPage = () => {
  const { username } = useParams<{ username: string }>();

  const navigate = useNavigate();

  const location = useLocation();

  const value = location.pathname.endsWith('/following')
    ? 'following'
    : 'followers';

  const { data, isLoading } = useQuery<UserDetails>({
    queryKey: [API_ENDPOINTS.USER_DETAILS(username || '')],
    enabled: !!username,
  });

  const {
    data: userConnections,
    isLoading: isLoadingUserConnections,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<InfiniteResponse<UserDetails>>({
    queryKey: [
      value === 'followers'
        ? API_ENDPOINTS.USER_FOLLOWERS(username || '')
        : API_ENDPOINTS.USER_FOLLOWING(username || ''),
      { size: '10' },
    ],
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const usersList = userConnections?.pages.flatMap((page) => page.data) || [];

  return (
    <div>
      <Header isLoading={isLoading} className="relative">
        {data ? (
          <div className="flex flex-col">
            <span>
              {data.firstName} {data.lastName}
            </span>
            <span className="text-muted-foreground text-xs">
              @{data.username}
            </span>
          </div>
        ) : (
          'User Details'
        )}
      </Header>

      <Tabs value={value} className="w-full gap-0">
        <TabsList variant="line" className="h-12">
          <TabsTrigger
            value="following"
            onClick={() =>
              navigate(`/users/${username}/following`, { replace: true })
            }
          >
            Following
          </TabsTrigger>
          <TabsTrigger
            value="followers"
            onClick={() =>
              navigate(`/users/${username}/followers`, { replace: true })
            }
          >
            Followers
          </TabsTrigger>
        </TabsList>
        <TabsContent value={value}>
          {isLoadingUserConnections ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col gap-8 p-4">
              {usersList.map((user) => (
                <RecommendedUser key={user.id} user={user} />
              ))}

              <div ref={ref} className="flex justify-center p-4">
                {isFetchingNextPage && <Spinner />}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserFollowsPage;
