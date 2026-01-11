import { USER_FIELDS } from '../constants/user-fields.constant';

export const GET_RECOMMENDED_USERS_QUERY = /* cypher */ `
  MATCH (me:User {id: $currentUserId})

  CALL {
      WITH me
      MATCH (me)-[:FOLLOWS]->(friend)-[:FOLLOWS]->(u:User)
      WHERE NOT (me)-[:FOLLOWS]->(u) AND u <> me
      RETURN u, count(friend) AS score, 1 AS priority

      UNION

      WITH me
      MATCH (u:User)
      WHERE NOT (me)-[:FOLLOWS]->(u) AND u <> me
      WITH u, COUNT { (:User)-[:FOLLOWS]->(u) } AS followers
      ORDER BY followers DESC LIMIT 50 
      RETURN u, followers AS score, 2 AS priority
  }

  WITH u, min(priority) as rank, max(score) as finalScore, me
  ORDER BY rank ASC, finalScore DESC
  SKIP $skip
  LIMIT $internalLimit

  RETURN u { ${USER_FIELDS} } AS user
`;
