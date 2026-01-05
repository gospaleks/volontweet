import { cn } from '@/lib/utils';

type H2Props = {
  className?: string;
  children: React.ReactNode;
};

const H2 = ({ className, children }: H2Props) => {
  return (
    <h2
      className={cn(
        'scroll-m-20 text-3xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h2>
  );
};

export default H2;
