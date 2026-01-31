import { TWEET_RETURN_PROJECTION } from '../constants/tweet-return-projection.constant';

export const UPDATE_TWEET_QUERY = /* cypher */ `
  MATCH (me:User {id: $currentUserId})-[:POSTED]->(t:Tweet {id: $tweetId})
  SET t.content = $raw,
      t.mentionsJson = $mentionsJson,
      t.imageUrl = $imageUrl,
      t.imagePublicId = $imagePublicId

  WITH t, me
  OPTIONAL MATCH (t)-[mentionRel:MENTIONS]->(mentioned:User)
  WHERE mentioned.username IN $removedMentions
  DELETE mentionRel

  WITH t, me
  OPTIONAL MATCH (t)-[tagRel:TAGGED_WITH]->(tag:Hashtag)
  WHERE tag.name IN $removedHashtags
  DELETE tagRel

  WITH t, me
  FOREACH (mUsername IN $addedMentions |
    MERGE (mentioned:User {username: mUsername})
    MERGE (t)-[:MENTIONS]->(mentioned)
  )

  WITH t, me
  FOREACH (tagName IN $addedHashtags |
    MERGE (tag:Hashtag {name: tagName})
    MERGE (t)-[:TAGGED_WITH]->(tag)
  )

  WITH t, me
  OPTIONAL MATCH (author:User)-[:POSTED]->(t)
  RETURN ${TWEET_RETURN_PROJECTION}
`;
