import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type HeaderProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
};

const Header = ({ children, isLoading, className }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'bg-background/70 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex items-center gap-2 border-b p-4 backdrop-blur',
        className,
      )}
    >
      <Tooltip delay={500}>
        <TooltipTrigger
          render={
            <Button size="icon-lg" variant="ghost" onClick={() => navigate(-1)}>
              <HugeiconsIcon icon={ArrowLeft02Icon} className="size-6" />
            </Button>
          }
        />
        <TooltipContent>Back</TooltipContent>
      </Tooltip>

      {isLoading ? <Skeleton className="h-6 w-32" /> : children}
    </div>
  );
};

export default Header;
