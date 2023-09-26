<template>
    <div>
      <h1>Highscore List</h1>
      <ul>
        <li v-for="highscore in highscores" :key="highscore.id">
          {{ highscore.name }} - {{ highscore.score }}
        </li>
      </ul>
      <div @click="fetchData">Fetch Data</div>
  
      <div v-if="highscores.length > 0">
        <p>Name: {{ highscores[0].name }}</p>
        <p>Score: {{ highscores[0].score }}</p>
        <!-- Display other properties of highscores[0] if available -->
      </div>
    </div>
  </template>
  
  <script>
  import db from '../js/firebase.js';
  
  export default {
    data() {
      return {
        highscores: []
      };
    },
    methods: {
      fetchData() {
        const highscoresRef = db.collection('/games/alphabetgames/highscores');
  
        highscoresRef.get()
          .then((querySnapshot) => {
            const highscores = [];
            querySnapshot.forEach((doc) => {
              highscores.push(doc.data());
            });
            this.highscores = highscores;
            console.log(highscores[0]);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  
  </style>
  