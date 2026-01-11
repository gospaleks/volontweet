export const USER_FIELDS = /* cypher */ `
  .*,
  stats: {
    isFollowedByMe: EXISTS { (me)-[:FOLLOWS]->(u) },
    followersCount: COUNT { (:User)-[:FOLLOWS]->(u) },
    followingCount: COUNT { (u)-[:FOLLOWS]->(:User) },
    tweetsCount: COUNT { (u)-[:POSTED]->(:Tweet) }
  }
`;
