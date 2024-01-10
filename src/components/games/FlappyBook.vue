<template>
    <TitleVue :title='pageTitle'></TitleVue>

    <div id="game" @click="startOrFlap">
      <div id="bird" :style="{ top: birdY + 'px', left: birdX + 'px'}"></div>
      <div v-for="pipe in pipes" :key="pipe.id" class="pipe" :style="pipeStyle(pipe)"></div>
    </div>

    <HighscoreComp 
        :scoreTitle='scoreTitle' 
        :userScoresPath="userPath"
        :databasePath="dbPath" 
        :buttonFunction="blinkLights" 
        :buttonText="startText"
        :buttonDisable="!currentlyPlaying && (autoRound=='Off' || sequenceLength!=0) || gameover || (autoRound=='On' && sequenceLength==0) "
        :score="sequenceLength-1"
        :scoreLabel="label"
        :sortWay="hightoLow"
    >
    </HighscoreComp>
</template>
  
  <script>
    import TitleVue from '../extra/Title.vue';
    import HighscoreComp from './HighscoreComp.vue';
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { getDatabase, ref, onValue, set, remove, get } from 'firebase/database';

    const db = getDatabase();
    const auth = getAuth();
  
  export default {
    name: 'FlappyBird',
    components: {
      TitleVue,
      HighscoreComp
    },
    data() {
      return {
        pageTitle: "Flappy Bird",
        birdY: 200,
        birdX: 300,
        birdVelocity: 0,
        gravity: 0,
        pipes: [],
        pipeSpeed: 1.5,
        score: 0,
        gameStarted: false,
        gameInterval: null,
        pipeInterval: null
      };
    },
    methods: {
        startOrFlap() {
            if (!this.gameStarted) {
            this.startGame();
            this.flap();
            } else {
            this.flap();
            }
        },
        flap() {
            if (this.gameStarted) {
            this.birdVelocity = -8;
            }
        },
        startGame() {
            this.gameStarted = true;
            this.gameInterval = setInterval(this.updateGame, 20);
            this.pipeInterval = setInterval(this.addPipe, 2000);
            this.gravity = 0.5;
        },
        pipeStyle(pipe) {
            return {
            left: pipe.x + 'px',
            height: pipe.height + 'px',
            top: pipe.y + 'px'
            };
        },
        updateGame() {
            this.birdY += this.birdVelocity;
            this.birdVelocity += this.gravity;
            this.pipes.forEach(pipe => {
                pipe.x -= this.pipeSpeed;
            });
            this.pipes = this.pipes.filter(pipe => pipe.x > -60);

            this.checkCollision();
            this.checkOutOfBounds();
            this.updateScore();
        },

        updateScore() {
            this.pipes.forEach(pipe => {
            // Increment score when the bird passes a pipe
            if (!pipe.scored && this.birdX > pipe.x + 60) {
                this.score += 0.5; // Increment by 0.5 because there are two pipes (top and bottom) per obstacle
                pipe.scored = true; // Mark pipe as scored to avoid multiple score increments
            }
            });
        },

        checkOutOfBounds() {
            if (this.birdY < 0 || this.birdY > 570) { // Adjusted for the new height
            this.resetGame();
            }
        },
        resetGame() {
            // Reset game state
            this.birdY = 200;
            this.birdVelocity = 0;
            this.pipes = [];
            this.score = 0;
            clearInterval(this.pipeInterval);
            clearInterval(this.gameInterval);
            this.birdY = 200;
            this.birdX = 300;
            this.birdVelocity = 0;
            this.gravity = 0;
            this.pipes = [];
            this.pipeSpeed = 1.5;
            this.score = 0;
            this.gameStarted = false;
            this.gameInterval = null;
            this.pipeInterval = null;
        },
        addPipe() {
            const pipeHeight = Math.floor(Math.random() * (600 / 2)) + 50; // Adjust for new height
            const spacing = 150;
            this.pipes.push({ id: Date.now(), x: 800, y: 0, height: pipeHeight });
            this.pipes.push({ id: Date.now() + 1, x: 800, y: pipeHeight + spacing, height: 600 - pipeHeight - spacing });
        },
        checkCollision() {
            for (let pipe of this.pipes) {
                if (this.birdX < pipe.x + 60 && this.birdX + 30 > pipe.x && this.birdY < pipe.y + pipe.height && this.birdY + 30 > pipe.y) {
                    // Collision detected
                    this.resetGame();
                    return;
                }
            }
        }
    },
  
    beforeDestroy() {
      clearInterval(this.gameInterval);
      clearInterval(this.pipeInterval);
    }
  };
  </script>
  
  
  <style scoped>
  #game {
    width: 600px;
    height: 600px;
    background-color: lightblue;
    position: relative;
    overflow: hidden;
    margin: auto;
  }
  #bird {
    width: 30px;
    height: 30px;
    background-color: red;
    position: absolute;
  }
  .pipe {
    width: 60px;
    position: absolute;
    bottom: 0;
    background-color: green;
  }
  </style>
     