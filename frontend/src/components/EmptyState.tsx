import { PackageSearchIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

type Props = {
  title: string;
  description?: string;
  icon?: typeof PackageSearchIcon;
  className?: string;
};

const EmptyState = ({
  title,
  description,
  icon = PackageSearchIcon,
  className,
}: Props) => {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={icon} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="leading-snug">
          {description || 'There is nothing to show here at the moment.'}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;
