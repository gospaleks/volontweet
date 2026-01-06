export type InfiniteResponse<T> = {
  data: T[];
  hasNextPage: boolean;
  nextPage: number | null;
};
