const auth = '/auth';

export const API_ENDPOINTS = {
  LOGIN: `${auth}/login`,
  REGISTER: `${auth}/register`,
  REFRESH_TOKEN: `${auth}/refresh`,
  LOGOUT: `${auth}/logout`,

  TWEETS: '/tweets',

  TRENDING_HASHTAGS: '/hashtags/trending',

  USER_SUGGESTIONS: '/users/suggestions',
};
