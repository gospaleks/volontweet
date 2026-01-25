import TweetsTimeline from '@/components/tweets/TweetsTimeline';
import Header from '@/components/Header';
import { API_ENDPOINTS } from '@/config/endpoints';
import H3 from '@/components/ui/typography/H3';

export default function UserLikesPage() {
  return (
    <div>
      <Header>
        <H3>Liked tweets</H3>
      </Header>
      <TweetsTimeline
        emptyDescription="No liked tweets yet"
        apiEndpoint={API_ENDPOINTS.LIKED_TWEETS}
      />
    </div>
  );
}
