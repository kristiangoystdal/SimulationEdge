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
      </div>
    </div>
  </template>
  
  <script>
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
        excludedData: [
          "start",
          "end",
          "units",
          "value",
          "toString",
          "toHTML",
          "addTo"
        ]
      };
    },
    methods: {
      updateTimer() {
        const now = new Date();
        const endDate = new Date(this.countdownDate);
  
        const result = countdown(now, endDate, countdown.DEFAULTS);
  
        // Update countdownValues with the result
        for (const unit in result) {
          if (result.hasOwnProperty(unit) && !this.excludedData.includes(unit)) {
            this.countdownValues[unit] = result[unit];
          }
        }
      },
    },
    mounted() {
      // Update the timer every second
      this.updateTimer();
      this.timerInterval = setInterval(this.updateTimer, 1000);
    },
    beforeDestroy() {
      // Clear the interval when the component is destroyed
      clearInterval(this.timerInterval);
    },
  };
  </script>
  
  <style scoped>
  @font-face {
    font-family: 'TitleFont';
    font-display: auto;
    font-weight: 400;
    font-style: normal;
    src: url('../../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
  }

  #box {
    margin: 2vw auto;
    max-width: 700px;
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
    gap: 1vw;
    justify-content: space-evenly;
  }

  .value-box {
    text-align: center;
    padding: 0.5vw;
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
  }
</style>