import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon } from '@hugeicons/core-free-icons';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { UserDetails } from '@/types/user.types';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

import Header from '@/components/Header';
import UserInfo from './components/UserInfo';

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
              {data.tweetsCount} {data.tweetsCount === 1 ? 'Tweet' : 'Tweets'}
            </span>
          </div>
        ) : (
          'User Details'
        )}
      </Header>

      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : isError || !data ? (
        <Empty className="flex items-center justify-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={UserIcon} />
            </EmptyMedia>
            <EmptyTitle>User "{username}" does not exist</EmptyTitle>
            <EmptyDescription>
              The user you are looking for could not be found.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <UserInfo user={data} />
      )}
    </div>
  );
};

export default UserDetailsPage;
