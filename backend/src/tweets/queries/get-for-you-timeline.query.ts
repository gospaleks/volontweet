import { TWEET_RETURN_PROJECTION } from '../constants/tweet-return-projection.constant';

export const GET_FOR_YOU_TIMELINE = /* cypher */ `
  MATCH (me:User {id: $currentUserId})

  // --- KORAK 1: Analiza korisnikovih interesovanja ---
  OPTIONAL MATCH (me)-[:LIKES|POSTED]->(interactionT:Tweet)-[:TAGGED_WITH]->(tag:Hashtag)
  WHERE interactionT.createdAt > datetime() - duration({days: 30})
  WITH me, collect(distinct tag.name) AS myInterests

  // --- KORAK 2: Sakupljanje Kandidata (Candidate Generation) ---
  CALL {
      WITH me, myInterests
      // A. Interest-based (Interesovanja)
      MATCH (t:Tweet)-[:TAGGED_WITH]->(tag:Hashtag)
      WHERE tag.name IN myInterests 
        AND t.createdAt > datetime() - duration({days: 7})
      RETURN t

      UNION

      WITH me
      // B. Social-based (Prijatelji lajkovali)
      MATCH (me)-[:FOLLOWS]->(friend)-[:LIKES]->(t:Tweet)
      WHERE t.createdAt > datetime() - duration({days: 7})
      RETURN t

      UNION
      
      WITH me
      // C. Mention-based
      // Ovo hvata tweetove gde je neko koga pratim "tagovan" (mentioned)
      MATCH (t:Tweet)-[:MENTIONS]->(friend)<-[:FOLLOWS]-(me)
      WHERE t.createdAt > datetime() - duration({days: 7})
      RETURN t

      UNION

      WITH me
      // D. Viral (Globalno popularni)
      MATCH (t:Tweet)
      WHERE t.createdAt > datetime() - duration({days: 3})
      AND count { (t)<-[:LIKES]-() } >= 5
      RETURN t
      
      UNION
      
      WITH me
      // E. Moji tweetovi
      MATCH (me)-[:POSTED]->(t:Tweet)
      RETURN t

      UNION

      WITH me
      // F. --- GLOBAL FALLBACK ---
      MATCH (t:Tweet)
      WHERE t.createdAt > datetime() - duration({hours: 48})
      RETURN t ORDER BY t.createdAt DESC LIMIT 50
  }

  // --- KORAK 3: Scoring & Deduplication ---
  WITH DISTINCT t, me, myInterests
  
  MATCH (author:User)-[:POSTED]->(t)
  
  // Izračunavanje metrika
  WITH t, me, author, myInterests,
       count { (t)<-[:LIKES]-() } AS likesCount,
       count { (me)-[:FOLLOWS]->(:User)-[:LIKES]->(t) } AS friendLikesCount,
       EXISTS { (t)-[:TAGGED_WITH]->(tag) WHERE tag.name IN myInterests } AS hasMyInterest,
       // Provera da li je prijatelj pomenut (za scoring)
       EXISTS { (t)-[:MENTIONS]->(:User)<-[:FOLLOWS]-(me) } AS mentionsFriend, 
       (author.id = me.id) AS isMyTweet,
       duration.between(t.createdAt, datetime()).hours AS ageInHours

  // Parcijalni skorovi
  WITH t, me, author, likesCount, ageInHours,
       (CASE WHEN hasMyInterest THEN 15.0 ELSE 0.0 END) AS interestScore,
       (friendLikesCount * 5.0) AS socialScore,
       // Dajemo jak boost (10.0) ako se pominje prijatelj
       (CASE WHEN mentionsFriend THEN 10.0 ELSE 0.0 END) AS mentionScore, 
       (likesCount * 0.5) AS popularityScore,
       (CASE WHEN isMyTweet THEN 2.0 ELSE 0.0 END) AS selfBoost

  // Finalni skor sa Time Decay
  WITH t, me, author, likesCount,
       (interestScore + socialScore + mentionScore + popularityScore + selfBoost + 1.0) AS rawScore,
       (1.0 + (toFloat(ageInHours) / 72.0)) AS decayFactor

  WITH t, me, author, likesCount, (rawScore / decayFactor) AS finalScore

  // --- KORAK 4: Sortiranje i Paginacija ---
  ORDER BY finalScore DESC
  SKIP $skip
  LIMIT $internalLimit

  RETURN ${TWEET_RETURN_PROJECTION} as tweet
`;
