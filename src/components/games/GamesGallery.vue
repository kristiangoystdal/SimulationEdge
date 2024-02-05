<template>
  <div>
    <TitleVue :title='pageTitle'></TitleVue>

    <div class="container">
      <div class="grid">
        <div v-for="(game, i) in publishedGames">
          <router-link :to="game.url" class="game-item">
            <img :src="game.logo" alt="Game" class="round-image">
            <span class="under-text">{{ game.name }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <br><br><br><br>

    <div class="title-box">
      <h4>Coming Soon</h4>
    </div>
    <div class="container">
      <div class="grid" :style="{ gridTemplateColumns: gridColumns }">
        <div v-for="(game, i) in ComingSoonGames" :key="i" class="grid-item">
          <router-link :to="game.url" class="game-item">
            <img :src="game.logo" alt="Game" class="round-image">
            <span class="under-text">{{ game.name }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import TitleVue from '../extra/Title.vue';

import Gaming_Central_Logo from '../../assets/photos/Gaming_Central_Logo.png'
import Alphabet_Game_Logo from '../../assets/photos/Type_the_Alphabet.png'
import Simon_Says_Logo from '../../assets/photos/SimonSaysLogo.png'
import FlappyBook_Logo from '../../assets/photos/FlappyBook.gif'
import MineSweeper_Logo from '../../assets/photos/minesweeperLogo.png'
import numbersGameLogo from '../../assets/photos/numbersGameLogo.webp'


export default {
  name: "GamesGallery",
  components: {
    TitleVue
  },
  data() {
    const publishedGames = [
      { name: 'Gaming Central', url: "games/gaming-central", logo: Gaming_Central_Logo },
      { name: 'The Alphabet Game', url: "games/the-alphabet-game", logo: Alphabet_Game_Logo },
      { name: 'Simon Says', url: "games/simon-says", logo: Simon_Says_Logo },
    ];
    const ComingSoonGames = [
      { name: 'Flappy Book', url: "games", logo: FlappyBook_Logo },
      { name: 'MineSweeper', url: "games", logo: MineSweeper_Logo },
      { name: 'Numbers Game', url: "games/numbers-game", logo: numbersGameLogo },
    ];

    return {
      publishedGames: publishedGames,
      ComingSoonGames: ComingSoonGames,
      activeVideoIndex: null,
      pageTitle: "Games",

    };
  },
  computed: {
    gridColumns() {
      if (this.isMobile) {
        return 'auto'; // or any other style suitable for mobile layout
      } else {
        if (this.ComingSoonGames.length > 2) {
          return `repeat(3, 1fr)`;
        } else {
          return `repeat(${this.ComingSoonGames.length}, 1fr)`;
        }
      }
    },
    isMobile() {
      // Use your preferred method to check if the device is mobile
      return window.innerWidth <= 768; // Example: consider devices with width 768px or less as mobile
    },
  },
}
</script>
  
<style scoped>
.title-box {
  text-align: center;
  font-family: 'TitleFont', sans-serif;
  /* text-decoration: underline; */
  margin-top: 3vw;
  font-size: 2vw;

}

.grid {
  display: grid;
  gap: 7vw;
  margin-top: 2vw;
  grid-template-columns: repeat(3, 1fr);
}

.round-image {
  border-radius: 50%;
  width: 15vw;
  height: auto;
  padding: 1vw;
}

.under-text {
  color: white;
  text-decoration: none;
  text-align: center;
  font-family: 'TitleFont', sans-serif;
  font-size: 2vw;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 2vw;
}

.game-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: none;
}

@font-face {
  font-family: 'TitleFont';
  src: url('../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
}

#coming-soon-title {
  font-size: 2vw;
}

@media (max-width: 768px) {
  .title-box {
    font-size: 6vw;
    margin-top: 7vw;
  }

  .grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .round-image {
    width: 50vw;
  }

  .under-text {
    font-size: 5vw;
  }

  .container {
    margin-top: 5vw;
  }
}
</style>
  