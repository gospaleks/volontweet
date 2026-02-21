import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type LogoProps = {
  size?: number;
  className?: string;
};

const Logo = ({ size = 32, className }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <img
      src="/images/vt_logo_256.png"
      alt="VolonTweet Logo"
      className={cn(
        'cursor-pointer transition-transform hover:scale-105 hover:brightness-120',
        className,
      )}
      width={size}
      height={size}
      title="Home"
      onClick={() => navigate('/')}
    />
  );
};

export default Logo;
