export const GET_TWEET_BY_ID_QUERY = /* cypher */ `
  MATCH (t:Tweet {id: $tweetId})
  RETURN t {
    .*
  }
`;
