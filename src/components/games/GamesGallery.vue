<template>
    <div>
      <div class="title-box">
        <h2>Our Games</h2>
      </div>
  
      <div class="container">
        <div class="grid">
          <div class="gridItem">
            <router-link to="/games/gaming-central" class="game-item">
              <img src="../../assets/photos/Gaming_Central_Logo.png" alt="Game" class="round-image">
              <span class="under-text">Gaming Central</span>
            </router-link>
          </div>
          <div class="gridItem">
            <router-link to="/games/the-alphabet-game" class="game-item">
              <img src="../../assets/photos/Type_the_Alphabet.png" alt="Game" class="round-image">
              <span class="under-text">The Alphabet Game</span>
            </router-link>
          </div>
          <div class="gridItem">
            <router-link to="/games/simon-says" class="game-item">
              <img src="../../assets/photos/SimonSaysLogo.png" alt="Game" class="round-image">
              <span class="under-text">Simon Says</span>
            </router-link>
          </div>
          <div class="gridItem">
            <router-link to="/games" class="game-item">
              <img src="../../assets/photos/FlappyBook.gif" alt="Game" class="round-image">
              <span class="under-text">Flappy Book</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
    export default{
      name: "GamesGallery"
    }
  </script>
  
  <style scoped>
    @media (min-width: 769px){
      .title-box {
        text-align: center;
        align-items: center;
        font-size: 3vw;
        text-decoration: underline;
        font-family: 'TitleFont', sans-serif;
        margin-top: 3vw;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: center;
        gap: 7vw;
        margin-top: 2vw;
      }

      .round-image {
        border-radius: 50%;
        width: 15vw;
        height: auto;
        padding: 1vw;
      }

      .under-text {
        color: black;
        text-decoration: none;
        font-size: 2vw;
        text-align: center;
        font-family: 'TitleFont', sans-serif;
        color: white;
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
          color: inherit;
          
      }

      @font-face {
          font-family: 'TitleFont';
          src: url('../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
      }
    }

    @media (max-width: 768px){
      .title-box {
        text-align: center;
        align-items: center;
        font-size: 6vw;
        text-decoration: underline;
        font-family: 'TitleFont', sans-serif;
        margin-top: 7vw;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        justify-items: center;
        gap: 7vw;
        margin-top: 2vw;
      }

      .round-image {
        border-radius: 50%;
        width: 50vw;
        height: auto;
        padding: 1vw;
      }

      .under-text {
        color: black;
        text-decoration: none;
        font-size: 5vw;
        text-align: center;
        font-family: 'TitleFont', sans-serif;
        color: white;
      }

      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 5vw;
      }

      .game-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-decoration: none;
          color: inherit;
          
      }

      @font-face {
          font-family: 'TitleFont';
          src: url('../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
      }
    }
  
</style>
