export const host = "http://localhost:5000";
const AUTH_ROUTE = `${host}/api/auth`;
export const loginRoute = `${AUTH_ROUTE}/login`;
export const registerRoute = `${AUTH_ROUTE}/register`;
export const logoutRoute = `${AUTH_ROUTE}/logout`;
export const setAvatarRoute = `${AUTH_ROUTE}/setavatar`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`;
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`;
const MESSAGES_ROUTE = `${host}/api/messages`;
export const ADD_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-message`;
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-image-message`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-audio-message`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGES_ROUTE}/get-initial-contacts`;
const USERS_ROUTE = `${host}/api/users`;
export const GET_USER_ROUTE = `${USERS_ROUTE}`;
