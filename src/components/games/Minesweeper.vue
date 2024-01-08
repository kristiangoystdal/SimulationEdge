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
                    :disabled="!gameRunning ? true:false || this.buttonStateArray[rowIndex][colIndex]"
                    @click="turn(rowIndex,colIndex)"
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

    const waste = null

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
                buttonStateArray: null, 
                gameRunning: true,
                gameOverState: false,
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
                this.buttonStateArray = null

                const val1 = null;
                const val2 = false;

                let tempArray1 = []
                let tempArray2 = []
                for (let i = 0; i < this.chosenHeight; i++) {
                    let row1 = [];
                    let row2 = [];
                    for (let j = 0; j < this.chosenLength; j++) {
                    row1.push(val1);
                    row2.push(val2);
                    }
                    tempArray1.push(row1);
                    tempArray2.push(row2);
                }
                this.mineArray = tempArray1;
                this.buttonStateArray = tempArray2;

                console.log(this.mineArray)
                console.log(this.buttonStateArray)
            },
            clearArray(){
                this.arrayMaker();
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
                return neighbors;
                
            },
            turn(row, col) {
                const gameState = this.CheckGameover(row, col);
                if (!gameState) {
                    const numberOfNeighbors = this.checkNeighbors(row, col);
                    this.buttonStateArray[row][col] = true;

                    // If there are no neighboring mines, call turn on each neighbor
                    if (numberOfNeighbors === 0) {
                        // Iterate through neighboring cells
                        for (let i = -1; i <= 1; i++) {
                            for (let j = -1; j <= 1; j++) {
                                let newRow = row + i;
                                let newCol = col + j;
                                
                                // Check if the neighbor is within bounds and not already revealed
                                if (newRow >= 0 && newRow < this.mineArray.length &&
                                    newCol >= 0 && newCol < this.mineArray[0].length &&
                                    !this.buttonStateArray[newRow][newCol]) {
                                    this.turn(newRow, newCol); // Recursively call turn on the neighbor
                                }
                            }
                        }
                    }
                    else{
                        this.mineArray[row][col] = numberOfNeighbors;
                    }
                } else {
                    this.clearArray();
                }
            },
            CheckGameover(row,col){
                if(this.mineArray[row][col]==10){
                    this.gameOverState = true; 
                    return true;
                }
                else{
                    return false;
                }
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
