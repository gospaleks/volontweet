import { cn } from '@/lib/utils';

type H4Props = {
  className?: string;
  children: React.ReactNode;
};

const H4 = ({ className, children }: H4Props) => {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h4>
  );
};

export default H4;
