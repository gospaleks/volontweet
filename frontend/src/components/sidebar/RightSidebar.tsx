import { Link } from 'react-router-dom';

import { ScrollArea } from '@/components/ui/scroll-area';

import WhoToFollow from './WhoToFollow';
import TrendingHashtags from './TrendingHashtags';
import OnlineUsersCount from './OnlineUsersCount';

const RightSidebar = () => {
  return (
    <ScrollArea className="h-full overflow-y-auto">
      <div className="flex h-full flex-col gap-4 p-4">
        <WhoToFollow />
        <TrendingHashtags />
        <OnlineUsersCount />

        <div className="mt-auto">
          <p className="text-muted-foreground text-right text-xs">
            &copy; {new Date().getFullYear()}{' '}
            <Link
              to="https://github.com/gospaleks/volontweet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline underline-offset-4"
            >
              VolonTweet
            </Link>
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default RightSidebar;
