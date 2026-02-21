import { API_ENDPOINTS } from '@/config/endpoints';

import TweetsTimeline from '@/components/tweets/TweetsTimeline';
import Header from '@/components/Header';
import H3 from '@/components/ui/typography/H3';

const UserLikesPage = () => {
  return (
    <div className="flex h-full flex-col">
      <Header>
        <H3>Liked tweets</H3>
      </Header>

      <TweetsTimeline
        emptyDescription="No liked tweets yet"
        apiEndpoint={API_ENDPOINTS.LIKED_TWEETS}
      />
    </div>
  );
};

export default UserLikesPage;
