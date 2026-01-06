export const GET_RECOMMENDED_USERS_QUERY = /* cypher */ `
  MATCH (me:User {id: $currentUserId})

  CALL {
      WITH me
      // --- Step 1: Friends of friends (High Priority) ---
      MATCH (me)-[:FOLLOWS]->(friend)-[:FOLLOWS]->(u:User)
      WHERE NOT (me)-[:FOLLOWS]->(u) AND u <> me
      // priority: 1 (highest)
      // score: number of mutual friends
      RETURN u, count(friend) AS score, 1 AS priority

      UNION

      WITH me
      // --- Step 2: Globally popular users (Low Priority / Supplement) ---
      MATCH (u:User)
      WHERE NOT (me)-[:FOLLOWS]->(u) AND u <> me
      OPTIONAL MATCH (u)<-[:FOLLOWS]-(follower)
      WITH u, count(follower) AS followers
      // Limiting the "pool" of popular users to avoid overwhelming the database
      ORDER BY followers DESC LIMIT 50 
      // priority: 2 (less important)
      // score: number of followers (used as secondary sort)
      RETURN u, followers AS score, 2 AS priority
  }

  // --- Step 3: Deduplication and Sorting ---
  // If a user is in both groups, take the min(priority) -> thus becomes '1' (friend of a friend)
  WITH u, min(priority) as rank, max(score) as finalScore

  // Key thing: First sort by rank (1 then 2), then by score
  ORDER BY rank ASC, finalScore DESC
  SKIP $skip
  LIMIT $internalLimit

  RETURN u {
      .id,
      .email,
      .username,
      .firstName,
      .lastName,
      .avatarUrl,
      .bio,
      mutualFollowersCount: CASE WHEN rank = 1 THEN finalScore ELSE 0 END
  } AS user
`;
