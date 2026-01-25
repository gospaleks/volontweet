export const CREATE_COMMENT_QUERY = /* cypher */ `
  MATCH (me:User {id: $currentUserId})
  MATCH (t:Tweet {id: $tweetId})
  MATCH (author:User)-[:POSTED]->(t)

  CREATE (me)-[:POSTED]->(c:Comment {
    id: $commentId,
    content: $content,
    createdAt: datetime()
  })-[:REPLY_TO]->(t)

  RETURN c { .* } AS comment, author.id AS tweetAuthorId
`;
