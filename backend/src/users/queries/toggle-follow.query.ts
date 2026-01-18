export const TOGGLE_FOLLOW_USER_QUERY = /* cypher */ `
  MATCH (me:User {id: $followerId})
  MATCH (target:User {id: $followedId})
  
  OPTIONAL MATCH (me)-[r:FOLLOWS]->(target)
  
  FOREACH (_ IN CASE WHEN r IS NOT NULL THEN [1] ELSE [] END |
    DELETE r
  )
  FOREACH (_ IN CASE WHEN r IS NULL THEN [1] ELSE [] END |
    CREATE (me)-[:FOLLOWS]->(target)
  )
  
  RETURN r IS NULL as followed, me
`;
