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


</template>

<script>
import TitleVue from '../extra/Title.vue';

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
            sequenceLength: 2,
            currentlyBlinking: true,
            currentlyPlaying: false,
            sequence: [],
            sequenceIndex: 0,
            gameover: false,
        };
    },
    components: {
        TitleVue
    },
    computed:{
        blinkDuration() {
            if(this.sequenceLength>20){
                return 500
            }
            else{
                return 1000-(25*(this.sequenceLength-1));
            }
        }    
    },
    methods: {
        async blinkLights() {
            this.currentlyBlinking= true;
            this.currentlyPlaying=true;
            this.sequence = [];
            this.sequenceIndex=0;
            for (let i = 0; i < this.sequenceLength; i++) {
                // Generate a random index to change the light color
                const randomIndex = Math.floor(Math.random() * this.lights.length);

                // Change the color of the selected light to yellow
                this.lights[randomIndex].color = 'green';

                // Add a delay before turning the light back to white
                await new Promise(resolve => setTimeout(() => {
                    this.lights[randomIndex].color = 'white';
                    this.sequence.push(randomIndex);
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
            }
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
