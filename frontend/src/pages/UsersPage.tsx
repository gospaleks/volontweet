import { useInfiniteQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { UserRecommendation } from '@/types/user.types';
import type { InfiniteResponse } from '@/types/infiniteResponse.type';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { Spinner } from '@/components/ui/spinner';
import Header from '@/components/Header';
import RecommendedUser from '@/components/RecommendedUser/RecommendedUser';
import H3 from '@/components/ui/typography/H3';

const UsersPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<InfiniteResponse<UserRecommendation>>({
      queryKey: [API_ENDPOINTS.USER_RECOMMENDATIONS, { size: '20' }],
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextPage : undefined,
    });

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  // Flatten the paginated data
  const users = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="flex flex-col gap-4">
      <Header>
        <H3>Suggested for you</H3>
      </Header>

      {isLoading ? (
        <div className="flex justify-center px-4">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-8 px-4">
          {users.map((user) => (
            <RecommendedUser key={user.id} user={user} showBio />
          ))}
        </div>
      )}

      <div ref={ref} className="flex justify-center p-4">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
};

export default UsersPage;
