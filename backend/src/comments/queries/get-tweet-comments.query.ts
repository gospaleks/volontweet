export const GET_TWEET_COMMENTS_QUERY = /* cypher */ `
  MATCH (t:Tweet {id: $tweetId})<-[:REPLY_TO]-(c:Comment)<-[:POSTED]-(author:User)
  
  WITH c, author
  ORDER BY c.createdAt DESC
  SKIP $skip
  LIMIT $limit

  RETURN 
    c {
      .*,
      createdAt: toString(c.createdAt)
    } AS comment,
    author {
      .*
    } AS author,
    (author.id = $currentUserId) AS isMyComment
`;
