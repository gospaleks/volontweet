import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { UserIcon } from '@hugeicons/core-free-icons';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { UserDetails } from '@/types/user.types';

import { Spinner } from '@/components/ui/spinner';

import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import UserInfo from './components/UserInfo';
import TweetsTimeline from '@/components/tweets/TweetsTimeline';

const UserDetailsPage = () => {
  const { username } = useParams<{ username: string }>();

  const { data, isLoading, isError } = useQuery<UserDetails>({
    queryKey: [API_ENDPOINTS.USER_DETAILS(username || '')],
    enabled: !!username,
  });

  return (
    <div className="flex h-full flex-col">
      <Header isLoading={isLoading}>
        {data ? (
          <div className="flex flex-col">
            <span>
              {data.firstName} {data.lastName}
            </span>
            <span className="text-muted-foreground text-xs">
              {data.stats.tweetsCount}{' '}
              {data.stats.tweetsCount === 1 ? 'Tweet' : 'Tweets'}
            </span>
          </div>
        ) : (
          'User Details'
        )}
      </Header>

      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      ) : isError || !data ? (
        <EmptyState
          title={`User "${username}" does not exist`}
          description="The user you are looking for could not be found."
          icon={UserIcon}
          className="flex items-center justify-center"
        />
      ) : (
        <>
          <UserInfo user={data} />
          <TweetsTimeline
            apiEndpoint={API_ENDPOINTS.TWEETS_FOR_USER(data.id)}
            emptyDescription="This user hasn't posted any tweets yet"
          />
        </>
      )}
    </div>
  );
};

export default UserDetailsPage;
