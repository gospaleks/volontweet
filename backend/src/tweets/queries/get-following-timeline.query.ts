import { TWEET_RETURN_PROJECTION } from '../constants/tweet-return-projection.constant';

export const GET_FOLLOWING_TIMELINE = /* cypher */ `
  MATCH (me:User {id: $currentUserId})
  
  // Uzmi tweetove ljudi koje pratim + MOJE tweetove
  MATCH (author:User)-[:POSTED]->(t:Tweet)
  WHERE (me)-[:FOLLOWS]->(author) OR author.id = $currentUserId

  // BITNO: Prvo radimo paginaciju dok su podaci "tanki"
  // Moramo preneti 'me' dalje jer nam treba za 'isLiked' proveru
  WITH t, author, me
  ORDER BY t.createdAt DESC
  SKIP $skip
  LIMIT $internalLimit

  // Ovde više nema OPTIONAL MATCH za lajkove, to sada radi projekcija
  RETURN ${TWEET_RETURN_PROJECTION} AS tweet
`;
