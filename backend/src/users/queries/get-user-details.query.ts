import { USER_FIELDS } from '../constants/user-fields.constant';

export const GET_USER_DETAILS_QUERY = /* cypher */ `
  MATCH (me:User {id: $currentUserId})

  MATCH (u:User {username: $username})

  RETURN u { ${USER_FIELDS} } AS user
`;
