<template>
    <TitleVue :title="pageTitle"></TitleVue>

    <div id="lightBox">
        <v-btn
            v-for="(light, index) in lights"
            :key="index"
            :id="'light-' + (index + 1)"
            :style="getLightStyle(light,index)"
            @click="buttonPress(index)"
            :class="{'disabledLight': currentlyBlinking || gameover,'light' : !currentlyBlinking && !gameover }"
        >
            {{ index + 1 }}
        </v-btn>
    </div>

    <HighscoreComp 
        :scoreTitle='scoreTitle' 
        :userScoresPath="userPath"
        :databasePath="dbPath" 
        :buttonFunction="blinkLights" 
        :buttonText="startText"
        :buttonDisable="!currentlyPlaying || gameover"
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
    name: 'SimonSays',
    data() {
        return {
            pageTitle: "Simon Says",
            lights: [
                { color: 'rgb(189, 189, 218)' },
                { color: 'rgb(189, 189, 218)' },
                { color: 'rgb(189, 189, 218)' },
                { color: 'rgb(189, 189, 218)' }
            ],
            currentIndex: 0,
            currentScore: 0,
            sequenceLength: 1,
            currentlyBlinking: true,
            currentlyPlaying: false,
            sequence: [],
            sequenceIndex: 0,
            gameover: false,
            dbPath: "simonsays",
            userPath: "simonsaysScores",
            scoreTitle: "Score",
            label: "",
            hightoLow: false,
        };
    },
    components: {
        TitleVue,
        HighscoreComp,
    },
    computed:{
        blinkDuration() {
            if(this.sequenceLength>20){
                return 500
            }
            else{
                return 1000-(25*(this.sequenceLength-1));
            }
        },
        user() {
            return this.$store.getters.getCurrUser;
        },  
        startText(){
            if(this.gameover){
                return "Start New Round"
            }
            else{
                return "Start Round " + this.sequenceLength.toString()
            }
        },
    },
    methods: {
        async blinkLights() {
            if(this.gameover){
                this.reset()
            }
            else{
                this.currentlyBlinking= true;
                this.currentlyPlaying=true;
                this.sequenceIndex=0;   
                // Generate a random index to change the light color
                const randomIndex = Math.floor(Math.random() * this.lights.length);
                this.sequence.push(randomIndex);
                for (let i = 0; i < this.sequence.length; i++) {
                    // Change the color of the selected light to yellow
                    this.lights[this.sequence[i]].color = 'green';

                    // Add a delay before turning the light back to white
                    await new Promise(resolve => setTimeout(() => {
                        this.lights[this.sequence[i]].color = 'rgb(189, 189, 218)';
                        resolve();
                    }, this.blinkDuration));

                    // Add another delay before the next blink
                    if (i < this.sequenceLength - 1) {
                        await new Promise(resolve => setTimeout(resolve, this.blinkDuration));
                    }
                }
                this.currentlyBlinking=false;
            }
        },
        buttonPress(index){
            if(!this.currentlyBlinking && !this.gameover){
                if(index==this.sequence[this.sequenceIndex]){
                    this.sequenceIndex++;
                    if(this.sequenceIndex==this.sequenceLength){
                        this.sequenceLength++;
                        this.currentlyPlaying=false;
                        this.currentlyBlinking=true;
                    }
                }
                else{
                    this.gameover=true;
                    this.lights[index].color = 'red';
                    this.GameOver();
                }
            }
        },
        GameOver(){
            if (this.user) {
                const uid = this.user.uid;
                const date = new Date();
                const datepath = date.getDate()+'q'+date.getMonth()+'q'+date.getFullYear()+'e'+date.getHours()+'w'+date.getMinutes()+'w'+date.getSeconds(); 
                // q = '-'
                // e = ' '
                // w = ':'

                const score = this.sequenceLength-1
                const path = `/users/${uid}/simonsaysScores/${datepath}`;

                // Add the timer value under the "simonsays" subfolder
                set(ref(db, path), score).then(() => {
                // Data added successfully
                }).catch((error) => {
                console.error('Error adding data:', error);
                });

                const displayPath = `${this.user.uid}`;
                // ',' = remove on load
                const latestPath = `/games/simonsays/latestScores/`+displayPath;

                // Add the timer value under the "latestScores" subfolder
                set(ref(db, latestPath), score).then(() => {
                // Data added successfully
                }).catch((error) => {
                console.error('Error adding data:', error);
                });


                const topPath = `/games/simonsays/highscores/` + displayPath;

                // Get the current value at topPath
                const currentScoreRef = ref(db, topPath);
                get(currentScoreRef).then((snapshot) => {
                    const currentScore = snapshot.val();

                    // Check if the current score is smaller than the new time
                    if (currentScore - score < 0 || currentScore == null) {
                        // Update the value under the "highscores" subfolder
                        set(currentScoreRef, score).then(() => {
                        // Data added successfully
                        }).catch((error) => {
                        console.error('Error updating data:', error);
                        });
                    }
                }).catch((error) => {
                    console.error('Error retrieving data:', error);
                });
            }
            else{
                console.log("No user logged in");
            }
        },
        updateTopScores (){
            const highScoresRef = ref(db, '/games/simonsays/highscores');
            const maxCount = 50;

            onValue(highScoresRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const dataArray = Object.entries(data).map(([key, value]) => ({ key, value }));

                // Sort the array in ascending order (lowest to highest)
                dataArray.sort((a, b) => a.value.score - b.value.score);

                if (dataArray.length > maxCount) {
                const itemsToRemove = dataArray.slice(maxCount);
                
                itemsToRemove.forEach((item) => {
                    const key = item.key;
                    remove(ref(db, `/games/simonsays/highscores/${key}`));
                });
                }
            }
            });  
        },
        reset(){
            this.lights=[
                { color: 'rgb(189, 189, 218)' },
                { color: 'rgb(189, 189, 218)' },
                { color: 'rgb(189, 189, 218)' },
                { color: 'rgb(189, 189, 218)'}
            ];
            this.currentScore= 0;
            this.sequenceLength=1,
            this.currentlyBlinking = true;
            this.currentlyPlaying= false;
            this.gameover= false;
            this.sequence=[];
        },
        getLightStyle(light, index) {

            return {
                backgroundColor: !this.currentlyBlinking ? 'white' : light.color,
                // Add other styles as needed
            };
        },
    },
    mounted() {

    }
};
</script>

<style scoped>
@media (min-width: 769px) {
    #lightBox{
      max-width: 1200px;
      width: 90%;
      border: solid;
      margin: auto;
      display: flex;
      justify-content: center;
      background-color:bisque;
      border-radius: 20px;
    }

    .light, .disabledLight {
        margin: 1vw;
        width: 10%;
        font-size: large;
        height: auto;
        text-align: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    /* .disabledLight {
        background-color: rgb(189, 189, 218);
    } */
    .light{
        background-color: #ffffff;
    }
}

@media (max-width: 768px) {
    
}
</style>
