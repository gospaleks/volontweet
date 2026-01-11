import { USER_FIELDS } from '../constants/user-fields.constant';

export const GET_USER_FOLLOWING_QUERY = /* cypher */ `
  MATCH (me:User {id: $currentUserId})
  
  MATCH (target:User {username: $username})

  MATCH (target)-[:FOLLOWS]->(u:User) 

  WITH u, me
  ORDER BY u.username ASC
  SKIP $skip
  LIMIT $internalLimit

  RETURN u { ${USER_FIELDS} } AS user
`;
