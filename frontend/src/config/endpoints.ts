export const API_ENDPOINTS = {
  LOGIN: `/auth/login`,
  REGISTER: `/auth/register`,
  REFRESH_TOKEN: `/auth/refresh`,
  LOGOUT: `/auth/logout`,

  TWEETS: '/tweets',

  TOGGLE_LIKE_TWEET: (tweetId: string) => `/tweets/${tweetId}/like`,

  // All tweet related endpoints have infinite scroll (queryParams: page, size)
  FEED_FOLLOWING: '/tweets/feed/following',
  FEED_FOR_YOU: '/tweets/feed/for-you',
  TWEETS_FOR_USER: (userId: string) => `/tweets/user/${userId}`,

  TRENDING_HASHTAGS: '/hashtags/trending',

  USERS: '/users',
  USER_SUGGESTIONS: '/users/suggestions',
  USER_RECOMMENDATIONS: '/users/recommendations', // Infinite scroll (queryParams: page, size)
  TOGGLE_FOLLOW_USER: (userId: string) => `/users/${userId}/follow`,
  USER_DETAILS: (username: string) => `/users/${username}`,
};
