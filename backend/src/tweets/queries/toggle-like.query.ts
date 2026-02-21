export const TOGGLE_LIKE_QUERY = /* cypher */ `
  MATCH (me:User {id: $userId})
  MATCH (t:Tweet {id: $tweetId})
  MATCH (author:User)-[:POSTED]->(t)

  OPTIONAL MATCH (me)-[r:LIKES]->(t)
  FOREACH (_ IN CASE WHEN r IS NOT NULL THEN [1] ELSE [] END |
    DELETE r
  )

  FOREACH (_ IN CASE WHEN r IS NULL THEN [1] ELSE [] END |
    CREATE (me)-[:LIKES]->(t)
  )

  RETURN 
    r IS NULL AS isLiked,
    COUNT { (t)<-[:LIKES]-(:User) } AS likesCount,
    t AS tweet,
    author,
    me
`;
