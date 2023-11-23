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
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    background-image: url('./assets/photos/bigger-gradient.png');
    background-repeat: repeat-y; /* Repeat the image vertically */
    background-size:auto;
  }


#content {
  position: relative;
  z-index: 1;
}

Footer {
  position: relative;
  z-index: 2;
}


</style>
