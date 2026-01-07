export const TWEET_RETURN_PROJECTION = /* cypher */ `
  t {
    .*,
    author: author {
      .id,
      .email,
      .username,
      .firstName,
      .lastName,
      .avatarUrl
    },
    stats: {
      likesCount: COUNT { (t)<-[:LIKES]-(:User) },
      isLikedByMe: EXISTS { (me)-[:LIKES]->(t) }
    }
  }
`;
