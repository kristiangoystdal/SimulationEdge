<template>
  <v-app ref="appRef">
    <Header ref="headerRef"></Header>

    <v-main>
      <div id="content" :style="{ minHeight: calcContentHeight}">
        <router-view></router-view>
      </div>
    </v-main>

    <Footer ref="footerRef"></Footer>
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
      headerHeight: 0,
      footerHeight: 0,
    };
  },
  components: {
    Header,
    Footer,
  },
  computed: {
    calcContentHeight() {
      return `calc(100vh - ${this.headerHeight + this.footerHeight}px)`;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.headerHeight = this.$refs.headerRef.$el.clientHeight;
      this.footerHeight = this.$refs.footerRef.$el.clientHeight;
    });
    window.addEventListener("resize", this.updateHeights);
  },
  methods: {
    updateHeights() {
      this.headerHeight = this.$refs.headerRef.$el.clientHeight;
      this.footerHeight = this.$refs.footerRef.$el.clientHeight;
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateHeights);
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
  height: 100%;
  background-image: url('./assets/photos/bigger-gradient.png');
  background-repeat: repeat-y;
  background-size: auto;
  display: flex;
  flex-direction: column;
  top: 0;
}

</style>
