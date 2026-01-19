import WhoToFollow from './WhoToFollow';
import TrendingHashtags from './TrendingHashtags';
import { ScrollArea } from '../ui/scroll-area';

const RightSidebar = () => {
  return (
    <ScrollArea className="h-full overflow-y-auto">
      <div className="flex h-full flex-col gap-4 p-4">
        <WhoToFollow />
        <TrendingHashtags />

        <div className="mt-auto">
          <p className="text-muted-foreground text-right text-xs">
            &copy; {new Date().getFullYear()} VolonTweet. All rights reserved.
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default RightSidebar;
