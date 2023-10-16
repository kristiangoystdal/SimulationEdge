import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref } from "vue"

const curUser = ref()

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    curUser.value = user
  } else {
    curUser.value = null
  }
});



