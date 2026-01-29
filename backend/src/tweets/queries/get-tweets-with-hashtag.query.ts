import { TWEET_RETURN_PROJECTION } from '../constants/tweet-return-projection.constant';

export const GET_TWEETS_WITH_HASHTAG_QUERY = /* cypher */ `
  MATCH (me:User {id: $currentUserId})

  MATCH (tag:Hashtag {name: $hashtag})<-[:TAGGED_WITH]-(t:Tweet)<-[:POSTED]-(author:User)

  WITH t, author, me
  ORDER BY t.createdAt DESC
  SKIP $skip
  LIMIT $internalLimit

  RETURN ${TWEET_RETURN_PROJECTION} AS tweet
`;
