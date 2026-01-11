export const API_ENDPOINTS = {
  LOGIN: `/auth/login`,
  REGISTER: `/auth/register`,
  REFRESH_TOKEN: `/auth/refresh`,
  LOGOUT: `/auth/logout`,

  TWEETS: '/tweets',

  TOGGLE_LIKE_TWEET: (tweetId: string) => `/tweets/${tweetId}/like`,

  FEED_FOLLOWING: '/tweets/feed/following', // Infinite scroll (queryParams: page, size)
  FEED_FOR_YOU: '/tweets/feed/for-you', // Infinite scroll (queryParams: page, size)
  TWEETS_FOR_USER: (userId: string) => `/tweets/user/${userId}`, // Infinite scroll (queryParams: page, size)

  TRENDING_HASHTAGS: '/hashtags/trending',

  USERS: '/users',
  USER_SUGGESTIONS: '/users/suggestions',
  USER_RECOMMENDATIONS: '/users/recommendations', // Infinite scroll (queryParams: page, size)
  TOGGLE_FOLLOW_USER: (userId: string) => `/users/${userId}/follow`,
  USER_DETAILS: (username: string) => `/users/${username}`,
  USER_FOLLOWERS: (username: string) => `/users/${username}/followers`, // Infinite scroll (queryParams: page, size)
  USER_FOLLOWING: (username: string) => `/users/${username}/following`, // Infinite scroll (queryParams: page, size)
};
