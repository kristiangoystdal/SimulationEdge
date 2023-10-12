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
        <div id="done-text">{{ doneText }}</div>
        <v-btn id="reset-button" @click="reset">
          Reset
        </v-btn>
        
      </div>
      <div id="highscoreBoard">
        <div id="highscoreTitle">Highscores</div>
        <div id="type">
          <div id="top">
            <div id="topTitle">Top</div>
            <div id="list">
              <ul>
                <li v-for="(item, index) in topScores" :key="index">
                  {{ index + 1 }}. {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <div id="latest">
            <div id="latestTitle">Latest</div>
            <div id="list">
              <ul>
                <li v-for="(item, index) in latestScores" :key="index">
                  {{ index + 1 }}. {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- <div id="game">
      <div id="alphabet">
        <span v-for="(letter, index) in alphabet" :key="letter" :id="letter" :class="{ 'green-text': index < currentIndex }">{{ letter }}</span>
      </div>
      <div>
        <input type="text" id="input-letter" maxlength="1" v-model="inputValue" @input="changeLetter">
      </div>
  
      <div id="timer">Time: {{ formattedTimer }} seconds</div>
  
      <div id="done-text">{{ doneText }}</div>
      <div>
        <div id="reset-button" @click="reset">Reset</div>
      </div>
    </div> -->
  </template>
  
<script>
  import TitleVue from '../extra/Title.vue';

  export default {
    data() {
      return {
        alphabet: "abcdefghijklmnopqrstuvwxyz".split(""),
        input: "".split(""),
        inputValue: "",
        currentIndex: 0,
        startTime: null,
        endTime: null,
        timer: 0,
        intervalId: null,
        doneText: "Done",
        win: null,
        pageTitle: "The Alphabet Game",
        topScores: [
          "Top 1",
          "Top 2",
          "Top 3",
          // Add your items here, up to 20
        ],
        latestScores: [
          "Item 1",
          "Item 2",
          "Item 3",          
          "Item 3",
          "Item 3",
          "Item 3",
          "Item 3",

          // Add your items here, up to 20
        ],

      };
    },
    components: {
      TitleVue
    },
    created() {
      this.startTimer();
    },
    computed: {
      formattedTimer() {
        return this.timer.toFixed(2);
      }
    },
    methods: {
      startTimer() {
        this.intervalId = setInterval(() => {
          if (this.startTime) {
            const now = new Date();
            const diff = (now - this.startTime) / 1000;
            this.timer = diff;
          }
        }, 10);
      },
      changeLetter() {
        if (event.key === 'Backspace') {
          // Check if Backspace key was pressed
          if (this.currentIndex > 0) {
            // Only remove the last item if there are items to remove
            this.currentIndex--;
            this.input[this.currentIndex] = ""; // Clear the last item
          }
        } else {
          this.input[this.currentIndex] = this.inputValue.toLowerCase();
          this.inputValue = "";
          this.currentIndex++;
        }
      },
      checkWin(){
        win = true;
        for(i = 0; i<this.alphabet.length; i++){
          if(input[i]!=this.alphabet[i]){
            win = false;
            break;
          }
        }
      },
      checkLetter() {
        const currentLetter = this.alphabet[this.currentIndex];
        if (this.inputValue.toLowerCase() === currentLetter) {
          if (currentLetter === "a" && this.currentIndex === 0) {
            this.startTime = new Date();
          }
  
          this.currentIndex++;
          this.inputValue = "";
  
          if (currentLetter === "z") {
            this.endTime = new Date();
            this.calculateTimeDifference();
            this.stopTimer();
          }
        }
      },
      calculateTimeDifference() {
        const diff = this.endTime - this.startTime;
        this.timer = Math.floor(diff / 10) / 100;
        this.doneText = `Congratulations! You completed the alphabet in ${this.timer.toFixed(2)} seconds.`;
      },
      stopTimer() {
        clearInterval(this.intervalId);
      },
      reset() {
        this.input = "";
        this.inputValue = "";
        this.currentIndex = 0;
        this.timer = 0;
        this.doneText = "";
        this.startTime = null;
        this.endTime = null;
        this.intervalId = null;
        this.alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      }
    }
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
    #top{
      border-right: solid;
      width: 50%;
    }
    #latest{
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
      padding-left: 10px;
      padding-bottom: 20px;
    }
    li{
      list-style: none;
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