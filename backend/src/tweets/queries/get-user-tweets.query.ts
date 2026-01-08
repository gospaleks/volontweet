import { TWEET_RETURN_PROJECTION } from '../constants/tweet-return-projection.constant';

export const GET_USER_TWEETS_QUERY = /* cypher */ `
  MATCH (me:User {id: $currentUserId})

  MATCH (author:User {id: $targetUserId})-[:POSTED]->(t:Tweet)

  WITH t, author, me
  ORDER BY t.createdAt DESC
  SKIP $skip
  LIMIT $internalLimit

  RETURN ${TWEET_RETURN_PROJECTION} AS tweet
`;
