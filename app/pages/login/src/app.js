import { constants } from "../../_shared/constants.js";
import UserDb from "../../_shared/userDb.js";

const { firebaseConfig } = constants;

const currentUser = UserDb.get();
if (Object.keys(currentUser).length) {
  redirectToLobby();
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var provider = new firebase.auth.GithubAuthProvider();
provider.addScope("read:user");

function redirectToLobby() {
  window.location = constants.pages.lobby;
}

function onLogin({ provider, firebase }) {
  return async () => {
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const { user } = result;
      const userData = {
        avatar: user.photoURL,
        username: user.displayName,
      };

      UserDb.insert(userData);

      redirectToLobby();
    } catch (error) {
      alert(JSON.stringify(error));
      console.log("erro", error);
    }
  };
}

const btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", onLogin({ provider, firebase }));
