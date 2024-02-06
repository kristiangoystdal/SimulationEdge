import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from './firebase.js';
import { getAuth, onAuthStateChanged} from "firebase/auth"
import { getDatabase, ref, get } from "firebase/database";


// Import page components
import StartPage from '../pages/main/StartPage.vue';
import Games from '../pages/main/Games.vue';
import Login from '../pages/main/Login.vue';
import Register from '../pages/main/Register.vue';
import Account from '../pages/main/Account.vue';
import Admin from '../pages/main/Admin.vue';
import Videos from '../pages/main/Videos.vue';
import GamingCentral from '../pages/games/GamingCentral.vue';
import AlphabetGame from '../pages/games/AlphabetGame.vue';
import SimonSays from '../pages/games/SimonSays.vue';
import FlappyBook from '../pages/games/FlappyBook.vue';
import MineSweeper from '../pages/games/MineSweeper.vue';
import NumbersGame from '../pages/games/NumbersGame.vue';

// Define routes
const routes = [
  { path: '/', name: "home", component: StartPage },
  { path: '/games', name: "games", component: Games },
  { path: '/videos', name: "videos", component: Videos },
  { path: '/login', name: "login", component: Login },
  { path: '/register', name: "register", component: Register },
  { path: '/account', name: "account", component: Account, meta: { requiresAuth: true },},
  { path: '/admin', name: "admin", component: Admin, meta: { requiresAuth: true, requiresAdmin: true },},
  { path: '/games/gaming-central', name: "gaming-central", component: GamingCentral },
  { path: '/games/the-alphabet-game', name: "the-alphabet-game", component: AlphabetGame },
  { path: '/games/simon-says', name: "simon-says", component: SimonSays },
  { path: '/games/flappy-book', name: "flappy-book", component: FlappyBook },
  { path: '/games/minesweeper', name: "minesweeper", component: MineSweeper },
  { path: '/games/numbers-game', name: "numbers-game", component: NumbersGame },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add this function to check if the user is an admin
async function isAdmin(userId) {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}`);
  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.role === 'admin'; // Check if the user's role is 'admin'
    }
    return false; // No user data found, or user does not have the 'admin' role
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      // If the route requires an admin role, additionally check if the user is an admin
      if (to.meta.requiresAdmin) {
        const userIsAdmin = await isAdmin(user.uid);
        if (userIsAdmin) {
          next(); // User is an admin, proceed to the route
        } else {
          next({ name: 'home' }); // User is not an admin, redirect to home
        }
      } else {
        next(); // For authenticated routes that don't require an admin role, proceed as usual
      }
    } else {
      next({ name: 'login' }); // Redirect to login if not authenticated
    }
  } else {
    next(); // For routes that don't require authentication, proceed as usual
  }
});

async function checkAuthentication() {
  return new Promise((resolve) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      resolve(!!user);
    });
  });
}

export default router;
