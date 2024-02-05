import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from './firebase.js';
import { getAuth, onAuthStateChanged} from "firebase/auth"


// Import page components
import StartPage from '../pages/main/StartPage.vue';
import Games from '../pages/main/Games.vue';
import Login from '../pages/main/Login.vue';
import Register from '../pages/main/Register.vue';
import Account from '../pages/main/Account.vue';
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

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      next({ name: 'home' }); // Redirect to home if not authenticated
    } else {
      next(); // Proceed to the requested route if authenticated
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
