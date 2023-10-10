<template>
  <div id="content">
    <Header ></Header>   
    <div id="router">
      <router-view></router-view> 
    </div>
    <!-- <Footer></Footer> -->
  </div>
  
</template>

<script>
  import Header from "./components/main/HeaderComp.vue"
  import Footer from "./components/main/Footer.vue"
  
  export default {
    name: 'App',
    data(){
      return{
        currUser: null
      }
    },
    components: {
      Header, Footer
    },
  }
</script>

<style >
  body {
      background-image: url('./assets/photos/gradient.png');
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: cover;
  }
  /* #app {
    min-height: 100vh; 
    margin: 0; 
  }

  #content{
    min-height: 100vh;
  }

  #router{
    min-height: 100vh;
  } */

  Footer{
    position: relative;
  }

</style>
