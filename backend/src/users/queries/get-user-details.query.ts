export const GET_USER_DETAILS_QUERY = /* cypher */ `
  MATCH (u:User {username: $username})

  // Check if the current user follows the target user
  OPTIONAL MATCH (me:User {id: $currentUserId})-[r:FOLLOWS]->(u)

  RETURN u {
    .*,
    tweetsCount: COUNT { (u)-[:POSTED]->(:Tweet) },
    followersCount: COUNT { (:User)-[:FOLLOWS]->(u) },
    followingCount: COUNT { (u)-[:FOLLOWS]->(:User) },
    
    isFollowedByMe: (r IS NOT NULL)
  } as user
`;
