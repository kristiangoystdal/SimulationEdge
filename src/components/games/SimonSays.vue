<template>
    <TitleVue :title="pageTitle"></TitleVue>

    <div id="lightBox">
        <v-btn
            v-for="(light, index) in lights"
            :key="index"
            :id="'light-' + (index + 1)"
            :style="{ backgroundColor: light.color }"
            :disabled="currentlyBlinking || gameover "
            @click="buttonPress(index)"
            class="light"
        >
            {{ index + 1 }}
        </v-btn>
    </div>
    <br>
    <v-btn v-if="!currentlyPlaying" @click="blinkLights">Start Round {{ sequenceLength }}</v-btn>
    <v-btn v-if="gameover" @click="reset">Restart</v-btn>
    <div v-if="gameover" id="gameover-text">
        Game Over
    </div>


    <HighscoreComp 
        :scoreTitle='scoreTitle' 
        :userScoresPath="userPath"
        :databasePath="dbPath" 
        :resetFunction="reset" 
        :score="sequenceLength"
        :scoreLabel="label"
        :sortWay="hightoLow"
    >
    </HighscoreComp> 

</template>

<script>
import TitleVue from '../extra/Title.vue';
import HighscoreComp from './HighscoreComp.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';

const db = getDatabase();
const auth = getAuth();

export default {
    name: 'SimonSays',
    data() {
        return {
            pageTitle: "Simon Says",
            lights: [
                { color: 'white' },
                { color: 'white' },
                { color: 'white' },
                { color: 'white' }
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
                console.log("Calc");
                return 1000-(25*(this.sequenceLength-1));
            }
        },
        user() {
            return this.$store.getters.getCurrUser;
        },  
    },
    methods: {
        async blinkLights() {
            console.log(this.blinkDuration);
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
                    this.lights[this.sequence[i]].color = 'white';
                    resolve();
                }, this.blinkDuration));

                // Add another delay before the next blink
                if (i < this.sequenceLength - 1) {
                    await new Promise(resolve => setTimeout(resolve, this.blinkDuration));
                }
            }
            this.currentlyBlinking=false;
            console.log(this.sequence)
        },
        buttonPress(index){
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
                console.log("Game Over...");
                this.GameOver();
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

                const score = this.sequenceLength
                console.log(score)
                const path = `/users/${uid}/simonsaysScores/${datepath}`;

                // Add the timer value under the "alphabetScores" subfolder
                set(ref(db, path), score).then(() => {
                // Data added successfully
                console.log("Added to user");
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


                const topPath = `/games/simonsays/highscores/`+displayPath+":"+datepath;

                // Add the timer value under the "highscores" subfolder
                set(ref(db, topPath), score).then(() => {
                // Data added successfully
                this.updateTopScores();
                }).catch((error) => {
                console.error('Error adding data:', error);
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
                { color: 'white' },
                { color: 'white' },
                { color: 'white' },
                { color: 'white' }
            ];
            this.currentScore= 0;
            this.sequenceLength=1,
            this.currentlyBlinking = true;
            this.currentlyPlaying= false;
            this.gameover= false;
        },
    },
    mounted() {

    }
};
</script>

<style scoped>
@media (min-width: 769px) {
    #lightBox {
        max-width: 600px;
        margin: auto;
        border: solid;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .light {
        margin: 1vw;
    }
}

@media (max-width: 768px) {
    
}
</style>
