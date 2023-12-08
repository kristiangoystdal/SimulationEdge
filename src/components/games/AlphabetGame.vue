<template>
  <TitleVue :title='pageTitle'></TitleVue>

  <v-container id="box">
    <div id="alphabet" class="alphabet-flex">
      <span v-for="(letter, index) in alphabet" :key="letter" :id="letter">
        <div id="chip" 
            :class="{ 
              'green-bg': index < currentIndex && input[index] == alphabet[index], 
              'red-bg': index < currentIndex && input[index] != alphabet[index], 
              'white-bg': index >= currentIndex 
            }"
            class="chip">
          {{ letter }}
        </div>
      </span>
    </div>
    
  </v-container>
  <div id="mobileBox">
      <input 
      id="inputField" 
      type="text"
      v-model="mobileInput"
      @input="handleMobileKey"
      @keydown="handleMobileKeyDown"
      ref="mobileInput"
      >
  </div>
  <!-- <div>
    {{ consoleLog }}
    {{ pressedKey }}
    {{ isMobile }}
  </div> -->

  <HighscoreComp 
    :scoreTitle='scoreTitle' 
    :userScoresPath="userPath"
    :databasePath="dbPath" 
    :resetFunction="reset" 
    :score="formattedTimer"
    :scoreLabel="label"
    :sortWay="highToLow"
    :buttonDisable="resetButtonState"
    :buttonText="resetButtonText"
    :buttonFunction="reset"
  >
  </HighscoreComp>    
</template>
  
<script>
  import TitleVue from '../extra/Title.vue';
  import HighscoreComp from './HighscoreComp.vue';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { getDatabase, ref, onValue, set, remove, get} from 'firebase/database';

  const db = getDatabase();
  const auth = getAuth();

  export default {
    data() {
      return {
        alphabet: "abcdefghijklmnopqrstuvwxyz",
        input: "",
        currentIndex: 0,
        startTime: null,
        timer: 0,
        intervalId: null,
        done: false,
        pageTitle: "The Alphabet Game",
        dbPath: "alphabetgame",
        userPath: "alphabetScores",
        scoreTitle: "Time",
        label: "seconds",
        highToLow: true,
        resetButtonState:true,
        resetButtonText: "Reset",
        mobileInput: '',
        consoleLog: '',
        pressedKey: null,
      };
    },
    components: {
      TitleVue,
      HighscoreComp,
    },
    computed: {
      formattedTimer() {
        return parseFloat(this.timer.toFixed(2));
      },
      user() {
        return this.$store.getters.getCurrUser;
      },
      isMobile(){
        const mobileWidthThreshold = 768; // Adjust as needed based on your design
        return window.innerWidth <= mobileWidthThreshold;
      },

    },
    methods: {
      startTimer() {
        this.startTime = new Date();
        this.intervalId = setInterval(() => {
          if (this.startTime) {
            const now = new Date();
            const diff = (now - this.startTime) / 1000;
            this.timer = diff;
          }
          if(!this.done){
            this.checkWin();
          }
        }, 10);
      },
      stopTimer() {
        clearInterval(this.intervalId);
      },
      handleKeyDown(event) {
        if(!this.isMobile){
          if (event.key === 'Backspace') {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.input = this.input.replace(/.$/, '');
            }
          } else if (event.key === 'Escape') {
              this.reset();
          } else if (this.currentIndex < this.alphabet.length) {
              if (event.key.toLowerCase() === 'a' && this.currentIndex === 0) {
                  this.startTimer();
              }

              this.input += event.key;
              this.currentIndex++;
              this.checkWin();
          }
        }
      },

      handleMobileKey() {
        // Check if the input field is focused
        const isInputFocused = document.activeElement === this.$refs.mobileInput;

        // On mobile, the 'input' event is used to capture changes in the input field
        if (isInputFocused) {
          this.pressedKey = this.$refs.mobileInput.value.slice(-1);
          this.pressedKey = this.pressedKey.toLowerCase();
          // Handle the pressed key as needed
          this.consoleLog = (`Pressed Key: ${this.pressedKey}`);
          if (this.pressedKey === 'Backspace') {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.input = this.input.replace(/.$/, '');
            }
          } else if (this.currentIndex < this.alphabet.length) {
              if (this.pressedKey.toLowerCase() === 'a' && this.currentIndex === 0) {
                  this.startTimer();
                  this.consoleLog = "Start";
              }

              this.input += this.pressedKey;
              this.currentIndex++;
              this.checkWin();
              this.mobileInput = '';
          }
        }
      },
      handleMobileKeyDown(event) {
        // Prevent default to avoid issues with certain key presses
        event.preventDefault();
      },

      checkWin() {
        if (this.input == this.alphabet) {
          this.stopTimer();
          this.done = true;

          if (this.user) {
            const uid = this.user.uid;
            const date = new Date();
            var datepath = date.getDate()+'q'+date.getMonth()+'q'+date.getFullYear()+'e';
            
            if(date.getHours()<10){
              datepath+="0"+date.getHours();
            }
            else{
              datepath+=date.getHours();
            }
            datepath+="w";
            if(date.getMinutes()<10){
              datepath+="0"+date.getMinutes();
            }
            else{
              datepath+=date.getMinutes();
            }
            datepath+="w";
            if(date.getSeconds()<10){
              datepath+="0"+date.getSeconds();
            }
            else{
              datepath+=date.getSeconds();
            }
            // q = '-'
            // e = ' '
            // w = ':'

            const time = this.timer.toFixed(2);
            const path = `/users/${uid}/alphabetScores/${datepath}`;

            // Add the timer value under the "alphabetScores" subfolder
            set(ref(db, path), time).then(() => {
              // Data added successfully
            }).catch((error) => {
              console.error('Error adding data:', error);
            });

            if(this.user.emailVerified){
              const displayPath = `${this.user.uid}`;
              const latestPath = `/games/alphabetgame/latestScores/`+displayPath;

              // Add the timer value under the "latestScores" subfolder
              set(ref(db, latestPath), time).then(() => {
                // Data added successfully
              }).catch((error) => {
                console.error('Error adding data:', error);
              });

              const topPath = `/games/alphabetgame/highscores/` + displayPath;

              // Get the current value at topPath
              const currentScoreRef = ref(db, topPath);
              get(currentScoreRef).then((snapshot) => {
                const currentScore = snapshot.val();

                // Check if the current score is smaller than the new time
                if (currentScore - time > 0) {
                  // Update the value under the "highscores" subfolder
                  set(currentScoreRef, time).then(() => {
                    // Data added successfully
                  }).catch((error) => {
                    console.error('Error updating data:', error);
                  });
                }
              }).catch((error) => {
                console.error('Error retrieving data:', error);
              });
            }
            

          }
        }
      },
      updateTopScores (){
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
        this.timer = 0;
        this.startTime = null;
        this.intervalId = null;
        this.done = false;
      },
    },
    mounted() {
      document.addEventListener('keydown', this.handleKeyDown);
    },
    beforeUnmount() {
      document.removeEventListener('keydown', this.handleKeyDown);
    },
  };
</script>



<style scoped>
    * {
        margin: 0;
        padding: 0;
    }
    .green-bg {
        background-color: green;
    }
    .white-bg{
      background-color: white;
    }

    .red-bg{
      background-color: red;
    }

    #box{
      max-width: 1200px;
      width: 90%;
      border: solid;
      margin: auto;
      display: flex;
      justify-content: center;
      background-color:bisque;
      border-radius: 20px;
    }

    .alphabet-flex {
      display: flex;
      flex-wrap: wrap; /* Allow items to wrap to the next row */
      justify-content: center;
      align-items: center;
      max-width: 100%; /* Ensure it doesn't overflow the container */
    }

    #chip {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      text-align: center;
      font-size: 20px; /* Replace 'auto' with a specific font size */
      border: solid;
    }

    #alphabet{
      display: flex;
      width: 100%;
      justify-content: center;
      height: auto;
    }

    #other{
      display: flex;
      max-width: 1200px;
      justify-content: center;
      margin: 2vw auto;
      text-align: center;
    }
    #otherbox{
      width: 45%; 
      margin: 2vw auto;
      margin-top: 0;
    }
    #user{
      width: 100%;  
      height: auto;       
      border: solid;
      text-align: center;
      border-radius: 20px;
      background-color: bisque;
    }
    #highscoreBoard{
      width: 100%;  
          height: auto;  
      margin: 2vw auto;
      margin-top: 0;
      border: solid;
      text-align: center;
      border-radius: 20px;
      background-color: bisque;
    }

    #timer{
      margin: 1vw;
      font-size: 2vw;
      font-family: 'TitleFont';
    }
    #reset-button{
      width: 20%;
      text-align: center;
      padding: 0.5vw;
      height: auto;
      background-color: white;
      border-radius: 2vw;
      border: solid;
    }
    #userList{
      width: 80%;
      margin: 2vw auto; 
      height: auto;  
      margin: 2vw auto;
      border: solid;
      text-align: center;
      border-radius: 20px;
      padding-bottom: 20px;
    }
    
    #userTitle{
      border-bottom: solid;
      margin: 0.5vw 0;
      font-size: 1.2vw;
      font-family: 'TitleFont';
      /* text-decoration: underline; */
    }
    
    #highscoreTitle{
      margin: 1vw;
      font-size: 2vw;
      font-family: 'TitleFont';
      text-decoration: underline;
    }
    #type{
      display: flex;
      margin: auto;
    }
    #topList{
      border-right: solid;
      width: 50%;
    }
    #latestList{
      width: 50%;
    }
    #topTitle{
      border-bottom: solid;
      margin: 0.5vw 0;
      font-size: 1.2vw;
      font-family: 'TitleFont';
      /* text-decoration: underline; */
    }
    #latestTitle{
      border-bottom: solid;
      margin: 0.5vw 0;
      font-size: 1.2vw;
      font-family: 'TitleFont';
      /* text-decoration: underline; */
    }
    #list{
      text-align: left;
      padding-left: 40px;
      padding-bottom: 20px;
      max-height: 300px;
      overflow-y: scroll;
    }
    #list::-webkit-scrollbar {
        width: 0.5vw;
    }
    #list::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
        border-radius: 10px;
    }
    #list::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
    }
    li{
      list-style: decimal;
    }


    @media (min-width: 769px) {
        #mobileBox{
          display: none;
        }
    }

    @media (max-width: 768px) {
        #mobileBox{
          max-width: 1200px;
          width: 90%;
          height: 50px;
          border: solid;
          margin: auto;
          display: flex;
          margin: 2vw auto;
          justify-content: center;
          background-color:bisque;
          border-radius: 20px;
        }
        #reset-button{
          width: 20%;
          text-align: center;
          padding: 3vw;
          height: 50px;
          background-color: white;
          border-radius: 2vw;
          border: solid;
        }
    }
</style>