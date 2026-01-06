import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type UseInfiniteScrollOptions = {
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  rootMargin?: string;
  enabled?: boolean;
};

export const useInfiniteScroll = ({
  fetchNextPage,
  hasNextPage = true,
  isFetchingNextPage = false,
  rootMargin = '0px',
  enabled = true,
}: UseInfiniteScrollOptions) => {
  const { ref, inView } = useInView({
    rootMargin,
    skip: !enabled,
  });

  useEffect(() => {
    if (!enabled) return;
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, enabled]);

  return { ref };
};
