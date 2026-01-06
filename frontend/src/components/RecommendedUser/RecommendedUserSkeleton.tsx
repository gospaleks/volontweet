import { Skeleton } from '@/components/ui/skeleton';

const RecommendedUserSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="size-9 rounded-full" />

      <div className="flex min-w-0 flex-1 flex-col gap-2 text-left text-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>

      <Skeleton className="h-8 w-16 rounded-4xl" />
    </div>
  );
};

export default RecommendedUserSkeleton;
