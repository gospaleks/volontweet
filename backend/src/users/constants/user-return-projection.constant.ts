export const USER_LIST_PROJECTION = /* cypher */ `
  u {
    .*,
    tweetsCount: COUNT { (u)-[:POSTED]->(:Tweet) },
    followersCount: COUNT { (:User)-[:FOLLOWS]->(u) },
    followingCount: COUNT { (u)-[:FOLLOWS]->(:User) },
    isFollowedByMe: EXISTS { (me)-[:FOLLOWS]->(u) }
  }
`;
