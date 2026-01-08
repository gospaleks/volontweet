import { TWEET_RETURN_PROJECTION } from '../constants/tweet-return-projection.constant';

export const GET_FOLLOWING_TIMELINE = /* cypher */ `
  MATCH (me:User {id: $currentUserId})
  
  MATCH (author:User)-[:POSTED]->(t:Tweet)
  WHERE (me)-[:FOLLOWS]->(author)

  WITH t, author, me
  ORDER BY t.createdAt DESC
  SKIP $skip
  LIMIT $internalLimit

  RETURN ${TWEET_RETURN_PROJECTION} AS tweet
`;
