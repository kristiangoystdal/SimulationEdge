<template>
    <TitleVue :title='pageTitle'></TitleVue>
    <div id="difficultSelector">
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
    </div>

    <div id="gameboard">
        <div class="flex" v-for="rowIndex in Array.from({ length: chosenHeight }, (_, i) => i)" :key="rowIndex">
            <div v-for="colIndex in Array.from({ length: chosenLength }, (_, i) => i)" :key="colIndex" 
                @contextmenu.prevent="handleRightClick($event, rowIndex, colIndex)">
                <v-btn 
                    class="cell" 
                    :disabled="this.buttonStateArray[rowIndex][colIndex]"
                    @click="turn(rowIndex,colIndex)"
                    :id="chosenDifficulty === 'easy' ? 'easycell' : ''"
                >
                    
                    <div v-if="cellStateArray[rowIndex][colIndex] === 0">
                        {{ mineArray[rowIndex][colIndex] }}
                    </div>
                    <font-awesome-icon :icon="['fas', 'flag']" v-if="cellStateArray[rowIndex][colIndex] === 1"></font-awesome-icon>
                    <font-awesome-icon :icon="['fas', 'bomb']" v-if="cellStateArray[rowIndex][colIndex] === 1"></font-awesome-icon>
                </v-btn>
            </div>
        </div>
    </div>

    <v-btn> {{ chosenMines }}</v-btn>
    <v-btn> {{ clickedCells }}</v-btn>
    <v-btn @click="minePlacer()">Place Mines</v-btn>

    <HighscoreComp 
        :scoreTitle='scoreTitle' 
        :userScoresPath="userPath"
        :databasePath="dbPath" 
        :resetFunction="reset" 
        :score="formattedTimer"
        :scoreLabel="label"
        :sortWay="highToLow"
        :buttonDisable="resetButtonState"
        :buttonText="resetButtonText"
        :buttonFunction="reset"
    >
    </HighscoreComp>

</template>

<script>
    import TitleVue from '../extra/Title.vue';
    import HighscoreComp from './HighscoreComp.vue';
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { getDatabase, ref, onValue, set, remove, get} from 'firebase/database';   

    const db = getDatabase();
    const auth = getAuth();

    const waste = null

    export default {
        name: 'MineSweeper',
        components: {
            TitleVue,
            HighscoreComp
        },
        data() {
            return {
                pageTitle: "MineSweeper",
                easyHeight: 5,
                easyLength: 10,
                easyMines: 10,
                mediumHeight: 12,
                mediumLength: 16,
                mediumMines: 40,
                hardHeight: 12,
                hardLength: 30,
                hardMines: 99,
                chosenDifficulty: "easy",
                chosenHeight: 5,
                chosenLength: 9,
                chosenMines: 10,
                mineArray: null,
                buttonStateArray: null, 
                gameRunning: false,
                gameOverState: false,
                cellStateArray: null,
                startTime: null,
                timer: 0,
                intervalId: null,
                done: false,
                dbPath: "minesweeper",
                userPath: "minesweepeScores",
                scoreTitle: "Time",
                label: "seconds",
                highToLow: true,
                resetButtonState:true,
                resetButtonText: "Reset",
                mobileInput: '',
                consoleLog: '',
                pressedKey: null,
                clickedCells: null,
            };
        },
        computed:{
            formattedTimer() {
                return parseFloat(this.timer.toFixed(1));
            },
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
                this.cellStateArray = null

                const val1 = null;
                const val2 = false;
                const val3 = null;

                let tempArray1 = []
                let tempArray2 = []
                let tempArray3 = []
                for (let i = 0; i < this.chosenHeight; i++) {
                    let row1 = [];
                    let row2 = [];
                    let row3 = [];
                    for (let j = 0; j < this.chosenLength; j++) {
                    row1.push(val1);
                    row2.push(val2);
                    row3.push(val3);
                    }
                    tempArray1.push(row1);
                    tempArray2.push(row2);
                    tempArray3.push(row3);
                }
                this.mineArray = tempArray1;
                this.buttonStateArray = tempArray2;
                this.cellStateArray = tempArray3;

                console.log(this.mineArray)
                console.log(this.buttonStateArray)
                console.log(this.cellStateArray)
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
                        this.cellStateArray[randomRow][randomCol]=0

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
            handleRightClick(event, rowIndex, colIndex) {
                event.preventDefault();  // Call this first

                console.log('Right-click detected on row:', rowIndex, 'col:', colIndex);
                if (!this.buttonStateArray[rowIndex][colIndex]) {
                    this.cellStateArray[rowIndex][colIndex] += 1;
                    if (this.cellStateArray[rowIndex][colIndex] == 2) {
                    this.cellStateArray[rowIndex][colIndex] = 0;
                    }
                } else {
                    console.log('Right-click not possible on row:', rowIndex, 'col:', colIndex);
                }
            },
            turn(row, col) {
                if(!this.gameRunning){
                    this.gameRunning=true;
                    this.startTimer();
                }
                const gameState = this.CheckGameover(row, col);
                this.cellStateArray[row][col]=0
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
                    this.checkWin();
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
            },
            checkWin(){
                this.clickedCells=0
                for (let i = 0; i < this.chosenHeight; i++) {
                    for (let j = 0; j < this.chosenLength; j++) {
                        if(this.buttonStateArray[i][j]==true){
                            this.clickedCells+=1
                        }
                    }
                    
                }
                const safeCells = this.chosenHeight*this.chosenLength-this.chosenMines;
                if(this.clickedCells==safeCells){
                    this.gameOverState = true; 
                    this.stopTimer();
                    this.stopGame();
                }
            },
            startTimer() {
                this.startTime = new Date();
                this.intervalId = setInterval(() => {
                if (this.startTime) {
                    const now = new Date();
                    const diff = (now - this.startTime) / 1000;
                    this.timer = diff;
                }
                if(!this.done){
                    // this.checkWin();
                }
                }, 10);
            },
            stopTimer() {
                clearInterval(this.intervalId);
            },
            reset(){
                this.startTime = null;
                this.timer = null;
                this.gameRunning = false;
                this.gameOverState = false;
                this.buttonStateArray = null;
                this.cellStateArray = null;
                this.mineArray = null;
                this.arrayMaker();
                this.clickedCells = 0;
            }
        },
    }
</script>

<style scoped>

#difficultSelector{
    border: solid;
    margin: 0 auto;
    margin-bottom: 0;
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
    margin-top: 0;
    border: solid;
}
.flex{
    display: flex;
    
}

.cell {
    width: 30px !important;
    height: 30px !important;
    min-width: 20px !important; /* To override Vuetify's minimum width */
    line-height: 20px !important; /* Adjust line height if needed */
    padding: 0 !important; /* Remove padding to maintain the size */
}

#easycell{
    width: 72px!important;
    height: 72px!important;
    min-width: 20px!important; /* To override Vuetify's minimum width */
    line-height: 20px!important; /* Adjust line height if needed */
    padding: 0!important; /* Remove padding to maintain the size */
}


    @media (min-width: 769px) {

    }

    @media (max-width: 768px) {

    }
</style>
