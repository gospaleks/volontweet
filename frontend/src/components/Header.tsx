import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import H3 from '@/components/ui/typography/H3';

type Props = {
  title: string;
};

const Header = ({ title }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-background/70 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex items-center gap-2 border-b p-4 backdrop-blur">
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

      <H3>{title}</H3>
    </div>
  );
};

export default Header;
