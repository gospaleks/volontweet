import { useParams } from 'react-router-dom';

import { API_ENDPOINTS } from '@/config/endpoints';

import H3 from '@/components/ui/typography/H3';

import Header from '@/components/Header';
import TweetsTimeline from '@/components/tweets/TweetsTimeline';

const HashtagTweetsPage = () => {
  const { hashtag } = useParams<{ hashtag: string }>();

  return (
    <div className="flex h-full flex-col">
      <Header>
        <H3>#{hashtag}</H3>
      </Header>

      <TweetsTimeline
        apiEndpoint={API_ENDPOINTS.HASHTAG_TWEETS(hashtag || '')}
        emptyDescription="No tweets found with this hashtag. Be the first to use it!"
      />
    </div>
  );
};

export default HashtagTweetsPage;
