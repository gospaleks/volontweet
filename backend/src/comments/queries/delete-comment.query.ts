export const DELETE_COMMENT_QUERY = /* cypher */ `
  MATCH (c:Comment {id: $commentId})<-[:POSTED]-(me:User {id: $currentUserId})
  WITH c AS comment, me

  DETACH DELETE comment

  RETURN comment
`;
