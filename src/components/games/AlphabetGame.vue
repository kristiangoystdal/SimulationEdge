<template>
    <v-container id="box" color="primary">
      <div id="alphabet">
        <span v-for="(letter, index) in alphabet" :key="letter" :id="letter">
          <div id="chip" :class="{ 'green-bg': index < currentIndex && input[index]==alphabet[index], 'red-bg': index < currentIndex && input[index]!=alphabet[index], 'white-bg': index >= currentIndex}">
            {{ letter }}
          </div>
        </span>
      </div>
    </v-container>

    <div id="game">
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
    </div>
  </template>
  
<script>
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
        doneText: "",
        win: null
        
      };
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
      border: solid;
      margin: auto;
      display: flex;
      justify-content: center;
      background-color:bisque;
      border-radius: 20px;
    }

    #chip{
      border-radius: 50%;
      width: 40px;
      height: 40px;
      text-align: center;
      font-size: auto;
      border: solid;
    }

    #alphabet{
      display: flex;
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