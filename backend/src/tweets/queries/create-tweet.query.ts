export const CREATE_TWEET_QUERY = /* cypher */ `
  // 1. Find author
  MATCH (author:User {id: $authorId})

  // 2. Create Tweet node
  CREATE (t:Tweet {
    id: $tweetId,
    content: $raw,
    mentionsJson: $mentionsJson,
    imageUrl: $imageUrl,
    imagePublicId: $imagePublicId,
    createdAt: datetime()
  })

  // 3. Connect author with tweet
  CREATE (author)-[:POSTED]->(t)

  // 4. Process Mentions (@)
  WITH t, author
  FOREACH (mUsername IN $userMentions |
    MERGE (mentioned:User {username: mUsername})
    MERGE (t)-[:MENTIONS]->(mentioned)
  )

  // 5. Process Hashtags (#)
  WITH t, author
  FOREACH (tagName IN $hashtags |
    MERGE (tag:Hashtag {name: tagName})
    MERGE (t)-[:TAGGED_WITH]->(tag)
  )

  RETURN t { 
    .*,
    createdAt: toString(t.createdAt)
   } as tweet,
   author {
    .*,
    createdAt: toString(author.createdAt)
   }
`;
