import { cn } from '@/lib/utils';

type H1Props = {
  className?: string;
  children: React.ReactNode;
};

const H1 = ({ className, children }: H1Props) => {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
        className,
      )}
    >
      {children}
    </h1>
  );
};

export default H1;
