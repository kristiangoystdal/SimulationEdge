<template>
    <TitleVue :title="pageTitle"></TitleVue>
    <div id="box">
        <div id="lightBox">
            <v-btn v-for="(light, index) in lights" :key="index" :id="'light-' + (index + 1)"
                :style="getLightStyle(light, index)" @click="buttonPress(index)"
                :class="{ 'disabledLight': currentlyBlinking || gameover, 'light': !currentlyBlinking && !gameover }">
                {{ index + 1 }}
            </v-btn>
        </div>
        <div id="switchBox">
            <div id="switch">
                <v-switch v-model="autoRound" hide-details inset :label="`Auto run: ${autoRound}`" true-value="On"
                    false-value="Off"></v-switch>
            </div>

        </div>

    </div>


    <HighscoreComp :scoreTitle='scoreTitle' :userScoresPath="userPath" :databasePath="dbPath" :buttonFunction="blinkLights"
        :buttonText="startText"
        :buttonDisable="!currentlyPlaying && (autoRound == 'Off' || sequenceLength != 0) || gameover || (autoRound == 'On' && sequenceLength == 0)"
        :score="sequenceLength - 1" :scoreLabel="label" :sortWay="hightoLow">
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
            autoRound: "Off",
        };
    },
    components: {
        TitleVue,
        HighscoreComp,
    },
    computed: {
        blinkDuration() {
            if (this.sequenceLength > 12) {
                return 300
            }
            else {
                return 600 - (25 * (this.sequenceLength - 1));
            }
        },
        user() {
            return this.$store.getters.getCurrUser;
        },
        startText() {
            if (this.gameover) {
                return "Start New Round"
            }
            else {
                return "Start Round " + this.sequenceLength.toString()
            }
        },
    },
    methods: {
        async blinkLights() {
            await new Promise(resolve => setTimeout(resolve, 200));
            if (this.gameover) {
                this.reset()
                if (this.autoRound == "On") {
                    this.blinkLights();
                }
            }
            else {
                this.currentlyBlinking = true;
                this.currentlyPlaying = true;
                this.sequenceIndex = 0;
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
                this.currentlyBlinking = false;
            }
        },
        buttonPress(index) {
            if (!this.currentlyBlinking && !this.gameover) {
                if (index == this.sequence[this.sequenceIndex]) {
                    this.sequenceIndex++;
                    if (this.sequenceIndex == this.sequenceLength) {
                        this.sequenceLength++;
                        this.currentlyPlaying = false;
                        this.currentlyBlinking = true;
                        if (this.autoRound == "On") {
                            this.blinkLights();
                        }
                    }
                }
                else {
                    this.gameover = true;
                    this.lights[index].color = 'red';
                    this.GameOver();
                }
            }
        },
        GameOver() {
            if (this.user) {
                const uid = this.user.uid;
                const date = new Date();
                var datepath = "";
                if (date.getDate() < 10) {
                    datepath += "0" + date.getDate();
                }
                else {
                    datepath += date.getDate();
                }
                datepath += 'q';
                if (date.getMonth() + 1 < 10) {
                    datepath += "0" + (date.getMonth() + 1);
                }
                else {
                    datepath += (date.getMonth() + 1);
                }
                datepath += 'q';
                datepath += date.getFullYear();
                datepath += 'e';

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

                const score = this.sequenceLength - 1
                const path = `/users/${uid}/simonsaysScores/${datepath}`;

                // Add the timer value under the "simonsays" subfolder
                set(ref(db, path), score).then(() => {
                    // Data added successfully
                }).catch((error) => {
                    console.error('Error adding data:', error);
                });


                if (this.user.emailVerified) {
                    const displayPath = `${this.user.uid}`;
                    const latestPath = `/games/simonsays/latestScores/` + displayPath;

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
            }
            else {
                console.log("No user logged in");
            }
        },
        updateTopScores() {
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
        reset() {
            this.lights = [
                { color: 'rgb(189, 189, 218)' },
                { color: 'rgb(189, 189, 218)' },
                { color: 'rgb(189, 189, 218)' },
                { color: 'rgb(189, 189, 218)' }
            ];
            this.currentScore = 0;
            this.sequenceLength = 1,
                this.currentlyBlinking = true;
            this.currentlyPlaying = false;
            this.gameover = false;
            this.sequence = [];
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
    #box {
        max-width: 1200px;
        width: 90%;
        border: solid;
        margin: auto;
        background-color: bisque;
        border-radius: 20px;
    }

    #lightBox {
        display: flex;
        justify-content: center;
    }

    #switchBox {
        margin: auto;
        width: auto;
        display: flex;
        align-items: center;
        justify-content: space-around;
        /* border: solid; */
    }

    #switch {
        width: auto;
        margin: auto;
        /* border: solid; */
        align-self: center;
    }

    .light,
    .disabledLight {
        margin: 1vw;
        width: 12%;
        height: 50px !important;
        font-size: large;
        height: auto;
        text-align: center;
        font-family: 'TitleFont';
    }

    .light {
        background-color: #ffffff;
    }
}

@media (max-width: 768px) {
    #lightBox {
        max-width: 1200px;
        /* Set the max-width for the 2x2 grid */
        width: 90%;
        border: solid;
        margin: auto;
        padding: 10px;
        display: flex;
        /* Use flex container */
        flex-wrap: wrap;
        /* Allow buttons to wrap to the next row */
        justify-content: center;
        align-items: center;
        /* Center vertically */
        background-color: bisque;
        border-radius: 20px;
        overflow: auto;
    }

    .light,
    .disabledLight {
        margin: 10px;
        /* Set margin to create space between buttons */
        width: 35vw !important;
        height: 35vw !important;
        font-size: x-large;
        text-align: center;
        font-family: 'TitleFont';
    }

    .light {
        background-color: #ffffff;
    }

    #switchBox {
        margin: 2vw auto auto auto;
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        justify-content: center;
        border: solid;
        border-radius: 20px;
        background-color: bisque;
        padding: 1vw 0;
    }

    #switch {
        width: auto;
        margin: auto;
    }
}
</style>
