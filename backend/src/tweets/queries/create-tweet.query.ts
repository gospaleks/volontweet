export const CREATE_TWEET_QUERY = /* cypher */ `
  // 1. Find author
  MATCH (author:User {id: $authorId})

  // 2. Create Tweet node
  CREATE (t:Tweet {
    id: $tweetId,
    content: $raw,
    mentionsJson: $mentionsJson,
    createdAt: datetime()
  })

  // 3. Connect author with tweet
  CREATE (author)-[:POSTED]->(t)

  // 4. Process Mentions (@) - Safe variant without breaking the query
  WITH t, author
  FOREACH (mUsername IN $userMentions |
    MERGE (mentioned:User {username: mUsername})
    MERGE (t)-[:MENTIONS]->(mentioned)
  )

  // 5. Process Hashtags (#) - Using CASE to prevent UNWIND from "killing" the query
  WITH t, author
  UNWIND (CASE WHEN $hashtags = [] THEN [null] ELSE $hashtags END) AS tagName
  WITH t, author, tagName
  WHERE tagName IS NOT NULL
  MERGE (tag:Hashtag {name: tagName})
  MERGE (t)-[:TAGGED_WITH]->(tag)

  // 6. Final return - again WITH to ensure a single row
  WITH DISTINCT t, author
  RETURN t {
    .*,
    author: {
      id: author.id,
      email: author.email,
      username: author.username,
      firstName: author.firstName,
      lastName: author.lastName
    },
    stats: {
      likesCount: 0,
      isLiked: false,
      isBookmarked: false
    }
  } as tweet
`;
