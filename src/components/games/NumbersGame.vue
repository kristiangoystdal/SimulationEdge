<template>
  <TitleVue :title='pageTitle'></TitleVue>

  <v-container id="box">
    <div id="content" v-if="timeLeft == 15">
      <v-btn @click="startTimer" id="btn">
        Start Round {{ score + 1 }}
      </v-btn>
    </div>
    <div id="content" v-else-if="timeLeft">
      <div id="numbersBox">
        {{ numbers }}
      </div>
      <div class="timer-container">
        <div class="timer-bar" :style="{ width: barWidth + '%' }"></div>
      </div>
    </div>
    <div id="content" v-else-if="done">
      <div id="input">
        <input type="text" id="inputBox" @input="restrictToNumbers">
      </div>
      <div id="btn">
        <v-btn @click="checkWin">
          Submit Number
        </v-btn>
      </div>
    </div>
  </v-container>

  <HighscoreComp :scoreTitle='scoreTitle' :userScoresPath="userPath" :databasePath="dbPath" :resetFunction="reset"
    :score="score" :scoreLabel="label" :sortWay="highToLow" :buttonDisable="resetButtonState"
    :buttonText="resetButtonText" :buttonFunction="reset">
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
  data() {
    return {
      numbers: "",
      input: "",
      done: false,
      pageTitle: "Numbers Game",
      dbPath: "numbersGame",
      userPath: "numbersGame",
      scoreTitle: "Score",
      label: "numbers",
      highToLow: true,
      resetButtonState: true,
      resetButtonText: "Reset",
      mobileInput: '',
      consoleLog: '',
      pressedKey: null,
      score: 0,
      totalTime: 15, // Total time in seconds
      timeLeft: 15,
      timer: null,
      intervalTime: 1000
    };
  },
  components: {
    TitleVue,
    HighscoreComp,
  },
  computed: {
    user() {
      return this.$store.getters.getCurrUser;
    },
    isMobile() {
      const mobileWidthThreshold = 768; // Adjust as needed based on your design
      return window.innerWidth <= mobileWidthThreshold;
    },
    barWidth() {
      // Calculate the width of the bar based on time left
      return (this.timeLeft / this.totalTime) * 100;
    },

  },
  methods: {
    startTimer() {
      this.randomNumbers();
      this.timeLeft = this.totalTime;
      this.done = false;
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft -= 0.01; // Decrement timeLeft in a scale that matches your update interval.
        } else {
          this.clearTimer(); // Once the timer reaches 0, clear the interval
          this.done = true;
          this.timeLeft = 0; // Ensure it's explicitly set to 0 to avoid negative values.
        }
      }, 10); // Update every 10ms for smoother countdown.
    },

    clearTimer() {
      clearInterval(this.timer); // Clear the interval
      this.timer = null; // Reset the timer property
    },
    randomNumbers() {
      this.numbers = ""
      for (let i = 0; i < this.score + 1; i++) {
        this.numbers += Math.floor(Math.random() * 10)
      }
    },
    checkWin() {
      if (this.input == this.numbers) {
        score++;
      }
      else {
        this.SendScore()
        this.reset()
      }
    },
    SendScore() {
      if (this.user) {
        const uid = this.user.uid;
        const date = new Date();
        var datepath = date.getDate() + 'q' + date.getMonth() + 'q' + date.getFullYear() + 'e';

        if (date.getHours() < 10) {
          datepath += "0" + date.getHours();
        }
        else {
          datepath += date.getHours();
        }
        datepath += "w";
        if (date.getMinutes() < 10) {
          datepath += "0" + date.getMinutes();
        }
        else {
          datepath += date.getMinutes();
        }
        datepath += "w";
        if (date.getSeconds() < 10) {
          datepath += "0" + date.getSeconds();
        }
        else {
          datepath += date.getSeconds();
        }
        // q = '-'
        // e = ' '
        // w = ':'

        const time = this.score;
        const path = `/users/${uid}/${this.userPath}/${datepath}`;

        // Add the timer value under the "alphabetScores" subfolder
        set(ref(db, path), time).then(() => {
          // Data added successfully
        }).catch((error) => {
          console.error('Error adding data:', error);
        });

        if (this.user.emailVerified) {
          const displayPath = `${this.user.uid}`;
          const latestPath = `/games/${this.dbPath}/latestScores/` + displayPath;

          // Add the timer value under the "latestScores" subfolder
          set(ref(db, latestPath), time).then(() => {
            // Data added successfully
          }).catch((error) => {
            console.error('Error adding data:', error);
          });

          const topPath = `/games/${this.dbPath}/highscores/` + displayPath;

          // Get the current value at topPath
          const currentScoreRef = ref(db, topPath);
          get(currentScoreRef).then((snapshot) => {
            const currentScore = snapshot.val();
            console.log('Current score:', currentScore);

            // Check if there is no current score or if the current score is greater than the new time
            if (currentScore === null || currentScore < time) {
              // Update the value under the "highscores" subfolder
              set(currentScoreRef, time).then(() => {
                console.log('Highscore updated successfully');
              }).catch((error) => {
                console.error('Error updating data:', error);
              });
            }
          }).catch((error) => {
            console.error('Error retrieving data:', error);
          });

        }
      }
    },
    updateTopScores() {
      const highScoresRef = ref(db, '/games/alphabetgame/highscores');
      const maxCount = 50;

      onValue(highScoresRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const dataArray = Object.entries(data).map(([key, value]) => ({ key, value }));

          // Sort the array in descending order (highest to lowest)
          dataArray.sort((a, b) => b.value.score - a.value.score);

          if (dataArray.length > maxCount) {
            const itemsToRemove = dataArray.slice(maxCount);

            itemsToRemove.forEach((item) => {
              const key = item.key;
              remove(ref(db, `/games/alphabetgame/highscores/${key}`));
            });
          }
        }
      });
    },
    reset() {
      this.input = "";
      this.currentIndex = 0;
      this.timer = null;
      this.done = false;
    },
    restrictToNumbers(event) {
      // Remove any non-digit characters from the input value
      event.target.value = event.target.value.replace(/\D/g, '');
    },
  },
  mounted() {
  },
  beforeUnmount() {
  },
};
</script>



<style scoped>
* {
  margin: 0;
  padding: 0;
}

#box {
  max-width: 1200px;
  width: 90%;
  max-height: 100vh;

  border: solid;
  margin: auto;
  display: flex;
  justify-content: center;
  background-color: bisque;
  border-radius: 20px;
}

#content {
  border: solid;
  width: 90%;
  margin: auto;
  justify-content: center;
  /* display: flexbox; */
  align-items: center;
}

#btn {
  margin: 2vw auto;
  justify-content: center;
  display: flex;

}

#numbersBox {
  max-width: 90%;
  text-align: center;
  font-size: xx-large;
  overflow-wrap: break-word;
  border: solid;
  margin: auto;
}


.timer-container {
  width: 50%;
  background-color: #e0e0e0;
  border: 1px solid #cccccc;
  height: 20px;
  border-radius: 5px;
  margin: 2vw auto 1vw auto;
}


.timer-bar {
  height: 100%;
  background-color: #ffffff;
  transition: width 0.1s linear;
  border-radius: 5px;
}

#inputBox {
  background-color: white;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 8px;
  outline: none;
}

#inputBox:focus {
  border-color: #4A90E2;
}


@media (min-width: 769px) {}

@media (max-width: 768px) {
  .timer-container {
    width: 90%;

  }
}
</style>