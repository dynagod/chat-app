export const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk"
];

export const AUTHENTICATE = 'auth/authenticate';
export const LOGOUT = 'auth/logoutUser';
export const UPDATE_USER = 'user/update';
export const REFRESH_ACCESS_TOKEN = 'update/accessToken'

export const GET_CHATS = 'get/chats';
export const CREATE_CHAT = 'create/chat';
export const CLEAR_CHAT = 'clear/chat';
export const GET_CHAT_BY_ID = 'get/chat';
export const DELETE_CHAT = 'delete/chat';

export const SEND_FRIEND_REQUEST = 'friendship/sendRequest';
export const GET_ALL_PENDING_REQUESTS = 'friendship/getPendingRequests';
export const ACCEPT_FRIEND_REQUEST = 'friendship/accept';
export const REJECT_FRIEND_REQUEST = 'friendship/reject';
export const REMOVE_FRIEND = 'friendship/remove';
export const GET_ALL_FRIENDS = 'friendship/getAllFriends';

export const GET_GROUP_CHATS = 'get/groupChats';
export const CREATE_GROUP_CHAT = 'create/groupChat';
export const ADD_USER_TO_GROUP = 'add/groupChat';
export const REMOVE_USER_FROM_GROUP = 'remove/groupChat';
export const UPDATE_GROUP_NAME = 'update/groupChat';
export const DELETE_GROUP = 'delete/groupChat';

export const GET_MESSAGES = 'get/messages';
export const SEND_MESSAGE = 'send/message';
export const DELETE_MESSAGE = 'delete/message';