export const API_ENDPOINTS = {
  LOGIN: `/auth/login`,
  REGISTER: `/auth/register`,
  REFRESH_TOKEN: `/auth/refresh`,
  LOGOUT: `/auth/logout`,

  TWEETS: '/tweets',

  TRENDING_HASHTAGS: '/hashtags/trending',

  USERS: '/users',
  USER_SUGGESTIONS: '/users/suggestions',
  USER_RECOMMENDATIONS: '/users/recommendations', // Infinite scroll (queryParams: page, size)
  TOGGLE_FOLLOW_USER: (userId: string) => `/users/${userId}/follow`,
  USER_DETAILS: (username: string) => `/users/${username}`,
};
