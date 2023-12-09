<template>
    <TitleVue :title='pageTitle'></TitleVue>
    <div id="difficultSelector" v-if="!gameRunning">
        Choose the difficulty:
        <div id="buttons">
            <v-btn @click="difficultySelector('easy')" :disabled="chosenDifficulty=='easy' ? true : false">
                Easy
            </v-btn>
            <v-btn @click="difficultySelector('medium')" :disabled="chosenDifficulty=='medium' ? true : false">
                Medium
            </v-btn>
            <v-btn @click="difficultySelector('hard')" :disabled="chosenDifficulty=='hard' ? true : false">
                Hard
            </v-btn>
        </div>

        {{ chosenMines }}
        
    </div>

    <div id="gameboard">
        <div class="flex" v-for="rowIndex in Array.from({ length: chosenHeight }, (_, i) => i)" :key="rowIndex">
            <div v-for="colIndex in Array.from({ length: chosenLength }, (_, i) => i)" :key="colIndex">
                <v-btn 
                    class="cell" 
                    :disabled="!gameRunning ? true:false"
                    @click="checkNeighbors(rowIndex,colIndex)"
                >
                    {{ mineArray[rowIndex][colIndex] }}
                </v-btn>
            </div>
        </div>
    </div>


    <v-btn @click="minePlacer()">Place Mines</v-btn>
    <v-btn @click="clearArray()">Clear</v-btn>
    <v-btn @click="checkNeighbors(2,4)">Check</v-btn>


</template>

<script>
    import TitleVue from '../extra/Title.vue';

    export default {
        name: 'MineSweeper',
        components: {
            TitleVue
        },
        data() {
            return {
                pageTitle: "MineSweeper",
                easyHeight: 5,
                easyLength: 9,
                easyMines: 10,
                mediumHeight: 16,
                mediumLength: 16,
                mediumMines: 40,
                hardHeight: 16,
                hardLength: 30,
                hardMines: 99,
                chosenDifficulty: "easy",
                chosenHeight: 5,
                chosenLength: 9,
                chosenMines: 10,
                mineArray: null,
                gameRunning: true,
            };
        },
        computed:{
            
        },
        created() {
            this.arrayMaker(); // Initialize the mineArray when component is created
        },
    
        methods:{
            difficultySelector(value){
                this.chosenDifficulty = value;

                if(value=="easy"){
                    this.chosenLength = this.easyLength;
                    this.chosenHeight = this.easyHeight;
                    this.chosenMines = this.easyMines;
                }
                else if (value=="medium"){
                    this.chosenLength = this.mediumLength;
                    this.chosenHeight = this.mediumHeight;
                    this.chosenMines = this.mediumMines;
                }
                else if (value=="hard"){
                    this.chosenLength = this.hardLength;
                    this.chosenHeight = this.hardHeight;
                    this.chosenMines = this.hardMines;
                }

                this.arrayMaker();
            },
            async arrayMaker(){
                this.mineArray = null
                let tempArray = []
                for (let i = 0; i < this.chosenHeight; i++) {
                    let row = [];
                    for (let j = 0; j < this.chosenLength; j++) {
                    row.push(null);
                    }
                    tempArray.push(row);
                }
                this.mineArray = tempArray;

                console.log(this.mineArray)
            },
            clearArray(){
                for (let i = 0; i < this.chosenHeight; i++) {
                    for (let j = 0; j < this.chosenLength; j++) {
                        this.mineArray[i][j] = null;
                    }
                }
            },
            minePlacer(){
                this.clearArray();
                console.log("test")
                for(let i = 0; i < this.chosenMines; i++){
                    const randomRow = Math.floor(Math.random() * this.chosenHeight);
                    const randomCol = Math.floor(Math.random() * this.chosenLength);
                    if(this.mineArray[randomRow][randomCol]==null){
                        this.mineArray[randomRow][randomCol]=10
                    }
                    else{
                        i-=1;
                    }
                }
            },
            checkNeighbors(row, col){
                let neighbors = 0
                for(let i = -1; i<2;i++){
                    if(row!=0){
                        if(this.mineArray[row-1][col+i]==10){
                            neighbors+=1;
                        }
                    }
                    if(row!=(this.chosenHeight-1)){
                        if(this.mineArray[row+1][col+i]==10){
                            neighbors+=1;
                        }
                    }
                    if(i!=0){
                        if(col==0 && i==-1){                        
                            console.log("border left")
                        }
                        else if(col == (this.chosenLength-1) && i==+1){
                            console.log("border right")
                        }
                        else{
                            if(this.mineArray[row][col+i]==10){
                                neighbors+=1;
                            }
                        }
                    }
                    
                }

                console.log("Number of neighbors: " + neighbors)
                
            }
        },
    }
</script>

<style scoped>

#difficultSelector{
    border: solid;
    margin: 0 auto;
    text-align: center;
    width: 20%;
}
#buttons{
    display: flex;
    margin-top: 1vw;
    justify-content: space-between;
}

#gameboard{
    margin: 2vw auto;
    border: solid;
}
.flex{
    display: flex;
    
}

.cell {
    width: 30px !important;
    height: 30px !important;
    min-width: 30px !important; /* To override Vuetify's minimum width */
    line-height: 30px !important; /* Adjust line height if needed */
    padding: 0 !important; /* Remove padding to maintain the size */
}

    @media (min-width: 769px) {

    }

    @media (max-width: 768px) {

    }
</style>
