export const TOGGLE_LIKE_QUERY = /* cypher */ `
  MATCH (u:User {id: $userId})
  MATCH (t:Tweet {id: $tweetId})

  OPTIONAL MATCH (u)-[r:LIKES]->(t)

  FOREACH (_ IN CASE WHEN r IS NOT NULL THEN [1] ELSE [] END |
    DELETE r
  )

  FOREACH (_ IN CASE WHEN r IS NULL THEN [1] ELSE [] END |
    CREATE (u)-[:LIKES]->(t)
  )

  RETURN 
    r IS NULL AS isLiked,
    COUNT { (t)<-[:LIKES]-(:User) } AS likesCount
`;
