import { cn } from '@/lib/utils';

type H3Props = {
  className?: string;
  children: React.ReactNode;
};

const H3 = ({ className, children }: H3Props) => {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h3>
  );
};

export default H3;
