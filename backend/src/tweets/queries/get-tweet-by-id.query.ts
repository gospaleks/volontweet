import { TWEET_RETURN_PROJECTION } from '../constants/tweet-return-projection.constant';

export const GET_TWEET_BY_ID_QUERY = /* cypher */ `
  MATCH (t:Tweet {id: $tweetId})
  MATCH (me:User {id: $currentUserId})
  OPTIONAL MATCH (author:User)-[:POSTED]->(t)
  RETURN ${TWEET_RETURN_PROJECTION}
`;
