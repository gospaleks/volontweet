export const DELETE_TWEET_QUERY = /* cypher */ `
  MATCH (u:User {id: $currentUserId})-[r:POSTED]->(t:Tweet {id: $tweetId})
  
  WITH t, t.imagePublicId AS imagePublicId
  
  DETACH DELETE t
  
  RETURN imagePublicId
`;
