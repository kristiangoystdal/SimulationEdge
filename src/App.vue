<template>
  <v-app>
    <Header></Header>

    <v-main>
      <div id="content">
        <router-view></router-view>
      </div>
    </v-main>

    <Footer></Footer>
  </v-app>
</template>

<script>
import Header from "./components/main/HeaderComp.vue";
import Footer from "./components/main/Footer.vue";

export default {
  name: "App",
  data() {
    return {
      currUser: null,
    };
  },
  components: {
    Header,
    Footer,
  },
};
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#content {
  height: 100%; /* Make sure #content takes up the full height of the viewport */
  background-image: url('./assets/photos/bigger-gradient.png');
  background-repeat: repeat-y; /* Repeat the image vertically */
  background-size: auto;
  display: flex;
  flex-direction: column;
  
}

Footer {
  position: relative;
  z-index: 2;
}
</style>
