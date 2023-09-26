// Import page components
import StartPage from '../pages/main/StartPage.vue'
import Games from '../pages/main/Games.vue'
import Login from '../pages/main/Login.vue'
import Register from '../pages/main/Register.vue'
import Account from '../pages/main/Account.vue'
import Videos from '../pages/main/Videos.vue'
import GamingCentral from '../pages/games/GamingCentral.vue'
import AlphabetGame from '../pages/games/AlphabetGame.vue'
// import FormulaCentral from '../pages/extra/FormulaCentral.vue'

// Define routes
const routes = [
  { path: '/', name: "home", component: StartPage },
  { path: '/games', name: "games", component: Games },
  { path: '/videos', name: "videos", component: Videos },
  { path: '/login', name: "login", component: Login },
  { path: '/register', name: "register", component: Register },
  { path: '/account', name: "account", component: Account },
  { path: '/games/gaming-central', name: "gaming-central", component: GamingCentral },
  { path: '/games/the-alphabet-game', name: "the-alphabet-game", component: AlphabetGame },
  // { path: '/formulacentral', name: "formula-central", component: FormulaCentral },
];

export default routes;
