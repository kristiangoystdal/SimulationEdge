<template>
  <div id="other">
    <div id="otherbox">
      <div id="user">
        <div id="timer">{{ scoreTitle }}: {{ score }} {{ scoreLabel }}</div>
        <div id="done-text" v-if="done">{{ doneText }}</div>
        <v-btn id="reset-button" @click="resetFunction">
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
          <br>
          Sign in to save scores
          <br>
          <br>
        </div>
        
      </div>
    </div>
    
    <div id="otherbox">
      <div id="highscoreBoard">
        <div id="highscoreTitle">Highscores</div>
        <div id="type">
          <div id="topList">
            <div id="topTitle">Top</div>
            <div id="list">
              <ul>
                <li v-for="(item, key) in topScores" :key="key">
                  {{ item[1] }} - {{ item[0] }}
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
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from 'firebase/database';

const db = getDatabase();
const auth = getAuth();

export default {
  data() {
    return {
      intervalId: null,
      doneText: "Congratulations! You did it!",
      done: false,
      win: null,
      topScores: [],
      latestScores: {}, 
      userScores: {},
      noscores: false,
      username: {},
    };
  },
  props: {
    databasePath: String,
    userScoresPath: String,
    scoreTitle: String, 
    resetFunction: Function,
    score: Number,
    scoreLabel: String,
    sortWay: Boolean,
  },
  created() {
    const userIDRef = ref(db, `/username`);
    onValue(userIDRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const dataArray = Object.entries(userData).map(([key, value]) => ({ key, value }));
        this.username = {};
        dataArray.forEach((item) => {
          this.username[item.key] = item.value;
        });
      } else {
        console.log("User data not found");
        displayNameKey = "No username";
      }
    });

    const topScoresRef = ref(db, `/games/${this.databasePath}/highscores`);

    onValue(topScoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.entries(data).map(([key, value]) => ({ key, value }));
        if (this.sortWay) {
          dataArray.sort((a, b) => a.value - b.value);
        } else {
          dataArray.sort((a, b) => b.value - a.value);
        }

        this.topScores = {};
        var index = 0;
        dataArray.forEach((item) => {
          const keyParts = item.key.split(':');
          const key = keyParts[0];
          const value = item.value;
          const displayNameKey = this.username[key];

          this.topScores[index] = [displayNameKey, value];
          index = index + 1;
        });
      }
    });

    const latestScoresRef = ref(db, `/games/${this.databasePath}/latestScores`);

    onValue(latestScoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.entries(data).map(([key, value]) => ({ key, value }));
        this.latestScores = {};
        dataArray.forEach((item) => {
          const keyParts = item.key.split(',');
          const key = keyParts[0];    
          const displayNameKey = this.username[key];

          const value = item.value;
          this.latestScores[displayNameKey] = value;
        });
      }
    });

    onAuthStateChanged(auth, (user) => {
      this.fetchDataAfterUserSet();
    });
  },
  methods: {
    fetchDataAfterUserSet() {
      if (this.$store.getters.getCurrUser != null) {
        const tempUser = this.$store.getters.getCurrUser;
        const uid = tempUser.uid;
        const userScoresRef = ref(db, `/users/${uid}/${this.userScoresPath}`);

        onValue(userScoresRef, (snapshot) => {
          if (snapshot.exists()) {
            this.noscores = false;
            const data = snapshot.val();

            if (data) {
              const dataArray = Object.entries(data).map(([key, value]) => ({ key, value }));
              if(this.sortWay){
                dataArray.sort((a, b) => a.value - b.value);
              }
              else{
                dataArray.sort((a, b) => b.value - a.value);
              }
              this.userScores = {};
              dataArray.forEach((item) => {
                const dateStr = item.key;
                const modifiedDateStr = dateStr.replace(/q/g, '-').replace(/e/g, ' ').replace(/w/g, ':');

                this.userScores[modifiedDateStr] = item.value;
              });
            }
          } else {
            this.noscores = true;
          }
        });
      }
    },
  },
  computed: {
    user() {
      return this.$store.getters.getCurrUser;
    },
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