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

  <div id="other">
    <div id="user">
      <div id="timer">Time: {{ formattedTimer }} seconds</div>
      <div id="done-text" v-if="done">{{ doneText }}</div>
      <v-btn id="reset-button" @click="reset">
        Reset
      </v-btn>
      
      

      <div id="userList" v-if="user">
        <div id="userTitle">Personal Best</div>
        <div id="list" v-if="!noscores">
          <ul>
            <li v-for="(value, key) in userScores" :key="key">
                {{ value }} - {{ key }}
            </li>
          </ul>
        </div>
        <div v-else>
          You have no scores yet...
        </div>
      </div>

      <div v-else>
        Sign in to save scores
      </div>
      
    </div>
    <div id="highscoreBoard">
      <div id="highscoreTitle">Highscores</div>
      <div id="type">
        <div id="topList">
          <div id="topTitle">Top</div>
          <div id="list">
            <ul>
              <li v-for="(value, key) in topScores" :key="key">
                {{ value }} - {{ key }}
              </li>
            </ul>
          </div>
        </div>
        <div id="latestList">
          <div id="latestTitle">Latest</div>
          <div id="list">
            <ul>
              <li v-for="(value, key) in latestScores" :key="key">
                {{ value }} - {{ key }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
    
</template>
  
<script>
  import TitleVue from '../extra/Title.vue';
  import { getDatabase, ref, onValue, set} from 'firebase/database';
  // import firebaseConfig from '../../js/firebaseConfig.js'
  
  const db = getDatabase();

  export default {
    data() {
      return {
        alphabet: "abcdefghijklmnopqrstuvwxyz".split(""),
        input: "".split(""),
        currentIndex: 0,
        startTime: null,
        timer: 0,
        intervalId: null,
        doneText: "Congratulations! You did it!",
        done: false,
        win: null,
        pageTitle: "The Alphabet Game",
        topScores: {},
        latestScores: {},
        userScores: {},
        noscores: false,
      };
    },
    components: {
      TitleVue,
    },
    created() {
      const topScoresRef = ref(db, '/games/alphabetgame/highscores');

      onValue(topScoresRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.entries(data).map(([key, value]) => ({ key, value }));
          dataArray.sort((a, b) => a.value - b.value);
          this.topScores = {};
          dataArray.forEach((item) => {
            this.topScores[item.key] = item.value;
          });
        }
      });

      const latestScoresRef = ref(db, '/games/alphabetgame/latestScores');

      onValue(latestScoresRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.entries(data).map(([key, value]) => ({ key, value }));
          dataArray.sort((a, b) => a.value - b.value);
          this.latestScores = {};
          dataArray.forEach((item) => {
            this.latestScores[item.key] = item.value;
          });
        }
      });

      const uid = this.user.uid;
      const userScoresRef = ref(db, `/users/${uid}/alphabetScores`);

      onValue(userScoresRef, (snapshot) => {
        if(snapshot.exists()){
          this.noscores = false;
          const data = snapshot.val();

          if (data) {
            const dataArray = Object.entries(data).map(([key, value]) => ({ key, value }));
            dataArray.sort((a, b) => a.value - b.value);
            this.userScores = {};
            dataArray.forEach((item) => {
              const dateStr = item.key;
              const modifiedDateStr = dateStr.replace(/q/g, '-').replace(/e/g, ' ').replace(/w/g, ':');

              this.userScores[modifiedDateStr] = item.value;
            });
          }
        } 
        else{
          this.noscores = true;
        }       
        
      });
    },
    computed: {
      formattedTimer() {
        return this.timer.toFixed(2);
      },
      user() {
        return this.$store.getters.getCurrUser;
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
        }, 10);
      },
      stopTimer() {
        clearInterval(this.intervalId);
      },
      handleKeyDown(event) {
        if (event.key === 'Backspace') {
          if (this.currentIndex > 0) {
            this.currentIndex--;
            this.input = this.input.replace(/.$/, '');
          }
        } 
        else if (this.currentIndex < this.alphabet.length) {
          if (event.key.toLowerCase() === 'a' && this.currentIndex === 0) {
            this.startTimer();
          }

          this.input += event.key;
          this.currentIndex++;
          this.checkWin()
        }
      },
      async checkWin() {
        let win = true;
        for (let i = 0; i < this.alphabet.length; i++) {
          if (this.input[i] !== this.alphabet[i]) {
            win = false;
            break;
          }
        }
        if (win) {
          this.stopTimer();
          this.done = true;

          if (this.user) {
            const uid = this.user.uid;
            const date = new Date();
            const datepath = date.getDate()+'q'+date.getMonth()+'q'+date.getFullYear()+'e'+date.getHours()+'w'+date.getMinutes(); 
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
              }
        }
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
    #user{
      width: 45%;  
      height: auto;  
      margin: 2vw auto;
      margin-top: 0;
      border: solid;
      text-align: center;
      border-radius: 20px;
      background-color: bisque;
    }
    #highscoreBoard{
      width: 45%;  
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
    }
    li{
      list-style: decimal;
    }


    /* @media (min-width: 769px) {
        #game {
            justify-content: center;
            text-align: center;
            margin: 4vw auto;
        }
        
        #alphabet {
            display: inline-block;
            margin: 3vw auto;
            border-radius: 2vw;
            padding: 1vw;
            background-color: purple;
            width: 90%;
            height: auto;
        }
        
        #alphabet span{
            font-size: 4vw;
            padding: 0.7%;
        }
        
        #input-letter{
            font-size: 5vw;
            margin-bottom: 2vw;
            width: 5%;
            text-align: center;
        }

        #timer{
            margin: 1vw;
            font-size: 3vw;
        }

        #reset-button{
            width: 10vw;
            height: auto;
            padding: 2vw;
            font-size: 2vw;
            margin: 5vw auto;
            background-color: white;
            border-radius: 2vw;
            border: solid;
        }
    }

    @media (max-width: 768px) {
        #game {
            justify-content: center;
            text-align: center;
            margin: 10vw auto;
        }
        
        #alphabet {
            display: inline-block;
            margin: 5vw auto;
            border-radius: 2vw;
            padding: 1vw;
            background-color: purple;
            width: 90%;
        }
        
        #alphabet span{
            font-size: auto;
            padding: 0.5%;
        }
        
        #input-letter, #current-letter {
            font-size: 10vw;
            margin-bottom: 2vw;
            width: 10%;
            text-align: center;
        }

        #timer{
            margin: 1vw;
            font-size: 5vw;
        }

        #reset-button{
            width: 20vw;
            height: auto;
            padding: 2vw;
            font-size: auto;
            margin: 5vw auto;
            background-color: white;
            border-radius: 2vw;
            border: solid;
        }
    } */
</style>