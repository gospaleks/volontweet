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

  // 4. Process Mentions (@) - FOREACH does not "kill" rows if the list is empty
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

  RETURN t { .* } as tweet
`;
