export const GET_TWEET_FOR_UPDATE_QUERY = /* cypher */ `
  MATCH (me:User {id: $currentUserId})-[:POSTED]->(t:Tweet {id: $tweetId})
  RETURN t { .* } as tweet
`;
