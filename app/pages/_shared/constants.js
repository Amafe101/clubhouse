export const constants = {
  socketURL: "http://localhost:3000",
  socketNamespaces: {
    room: "room",
    lobby: "lobby",
  },
  peerConfig: Object.values({
    id: undefined,
    // config: {
    //   port: 9000,
    //   host: 'localhost',
    //   path: '/'
    // }
  }),
  pages: {
    lobby: "/pages/lobby",
    login: "/pages/login",
  },

  events: {
    USER_CONNECTED: "userConnection",
    USER_DISCONNECTED: "userDisconnection",

    JOIN_ROOM: "joinRoom",

    LOBBY_UPDATED: "lobbyUpated",
    UPGRADE_USER_PERMISSION: "upgradeUserPermission",

    SPEAK_REQUEST: "speakRequest",
    SPEAK_ANSWER: "speakAnswer",
  },
  firebaseConfig: {
    apiKey: "AIzaSyCGGMzY4UUIIEcvxJlRS62nzb7bY_CazLU",
    authDomain: "semana-js-expert-eab4a.firebaseapp.com",
    projectId: "semana-js-expert-eab4a",
    storageBucket: "semana-js-expert-eab4a.appspot.com",
    messagingSenderId: "208709820692",
    appId: "1:208709820692:web:34247640e578b0fa6be201",
    measurementId: "G-F8S1HPR3VF",
  },
  storageKey: "jsexpert:storage:user",
};
