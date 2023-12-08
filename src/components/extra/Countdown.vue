<template>
    <div id="box">
      <div id="countdown" class="countdown-grid">
        <div v-for="(value, label, index) in countdownValues" :key="index" class="value-box">
          <div>
            <h1>{{ value }}</h1>
          </div>
          <div>
            {{ label }}
          </div>
        </div>
      </div>
      <div id="title">
        UNTIL RELEASE
        test
      </div>
    </div>
  </template>
  
  <script>
  // Imports countdown function from countdown.js
  import countdown from "../../js/countdown.js";
  
  export default {
    name: 'Title',
    props: {
      countdownDate: String,
    },
    data() {
      return {
        countdownValues: {
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        },
        // Values from countdown function that are not needed
        excludedData: [
          "start",
          "end",
          "units",
          "value",
          "toString",
          "toHTML",
          "addTo"
        ],
        countdownDone: false,
      };
    },
    methods: {
      // Function to update the timer values
      updateTimer() {

        // Current time and goal time
        const now = new Date();
        const endDate = new Date(this.countdownDate);

        // Checks if we have passed the end date or not
        if (now > endDate) {
          // Set all values to zero
          this.countdownValues = {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          };
          this.countdownDone = true;
          clearInterval(this.timerInterval); // Stops the interval loop
          return; // Stops further execution
        }

        // Updates the values if end date is in the future
        else{
          // The difference from now 
          const result = countdown(now, endDate, countdown.DEFAULTS);
    
          // Update countdownValues with the result. excluding the keys listed in 'excludedData'
          for (const unit in result) {
            if (result.hasOwnProperty(unit) && !this.excludedData.includes(unit)) {
              this.countdownValues[unit] = result[unit];
            }
          }
        }
      },
    },
    mounted() {
      // Updates the timer every second
      this.updateTimer();
      this.timerInterval = setInterval(() => {
        this.updateTimer();
      }, 1000); 
    },
    beforeDestroy() {
      // Clear the interval when the component is destroyed
      clearInterval(this.timerInterval);
    },
  };
  </script>


<style scoped>
  /* Styles for the Countdown Component */
  @font-face {
    font-family: 'TitleFont';
    font-display: auto;
    font-weight: 400;
    font-style: normal;
    src: url('../../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
  }

  #box {
    margin: 2vw auto;
    max-width: 1200px;
    width: 90%;
    height: auto;
    right: 0;
    align-items: center;
    padding: 2vw 0;
    background-color: bisque;
    border-radius: 20px;
    border: solid;
  }

  #title {
    text-align: center;
    font-size: 2vw;
    font-family: 'TitleFont', sans-serif;
    padding-top: 3vw;
  }

  #countdown {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
    gap: 2%;
    justify-content: space-evenly;
  }

  .value-box {
    text-align: center;
    padding: 0;
  }

  @media (min-width: 769px) {
    h1 {
      text-align: center;
      font-size: 4vw;
      font-family: 'TitleFont', sans-serif;
      padding-bottom: 3vw;
      padding-top: 3vw; 
    }
    #countdown {
      grid-template-columns: repeat(auto-fill, minmax(15%, 1fr));
    }
    #box{
      margin-bottom: 10vw;
    }
  }

  @media (max-width: 768px) {
    h1 {
      text-align: center;
      font-size: 8vw;
      font-family: 'TitleFont', sans-serif;
      padding-bottom: 3vw;
      padding-top: 3vw;
    }

    #title {
      text-align: center;
      font-size: 5vw;
      font-family: 'TitleFont', sans-serif;
      padding-top: 3vw;
    }
    #box{
      margin-bottom: 2vw;
    }
  }
</style>