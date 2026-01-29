export const API_ENDPOINTS = {
  LOGIN: `/auth/login`,
  REGISTER: `/auth/register`,
  REFRESH_TOKEN: `/auth/refresh`,
  LOGOUT: `/auth/logout`,

  TWEETS: '/tweets',
  TWEET_BY_ID: (tweetId: string) => `/tweets/${tweetId}`,
  TOGGLE_LIKE_TWEET: (tweetId: string) => `/tweets/${tweetId}/like`,
  DELETE_TWEET: (tweetId: string) => `/tweets/${tweetId}`,
  HASHTAG_TWEETS: (hashtag: string) => `/tweets/hashtag/${hashtag}`, // Infinite scroll (queryParams: page, size)

  FEED_FOLLOWING: '/tweets/feed/following', // Infinite scroll (queryParams: page, size)
  FEED_FOR_YOU: '/tweets/feed/for-you', // Infinite scroll (queryParams: page, size)
  TWEETS_FOR_USER: (userId: string) => `/tweets/user/${userId}`, // Infinite scroll (queryParams: page, size)
  LIKED_TWEETS: '/tweets/liked', // Infinite scroll (queryParams: page, size)

  POST_TWEET_COMMENT: (tweetId: string) => `/comments/${tweetId}`,
  COMMENTS_BY_TWEET_ID: (tweetId: string) => `/comments/${tweetId}`, // Infinite scroll (queryParams: page, size)
  DELETE_TWEET_COMMENT: (commentId: string) => `/comments/${commentId}`,

  TRENDING_HASHTAGS: '/hashtags/trending',

  USERS: '/users',
  USER_SUGGESTIONS: '/users/suggestions',
  USER_RECOMMENDATIONS: '/users/recommendations', // Infinite scroll (queryParams: page, size)
  TOGGLE_FOLLOW_USER: (userId: string) => `/users/${userId}/follow`,
  USER_DETAILS: (username: string) => `/users/${username}`,
  USER_FOLLOWERS: (username: string) => `/users/${username}/followers`, // Infinite scroll (queryParams: page, size)
  USER_FOLLOWING: (username: string) => `/users/${username}/following`, // Infinite scroll (queryParams: page, size)
  UPLOAD_USER_AVATAR: '/users/avatar',
  UPLOAD_USER_BANNER: '/users/banner',

  NOTIFICATIONS: '/notifications', // Infinite scroll (queryParams: page, size)
  NOTIFICATIONS_UNREAD_COUNT: '/notifications/unread-count',
  DELETE_NOTIFICATION: (notificationId: string) =>
    `/notifications/${notificationId}`,
  MARK_ALL_NOTIFICATIONS_AS_READ: '/notifications/mark-all-as-read',
};
