<template>
  <!-- <VideoGallery></VideoGallery> -->
  <WorldMapVideos></WorldMapVideos>
</template>

<script>
  import DevelopmentComp from '../../components/main/DevelopmentComp.vue'
  import VideoGallery from '../../components/videos/VideoGallery.vue'
  import WorldMapVideos from '../../components/videos/WorldMapVideos.vue'

  export default {
    name: 'VideosPage',
    components: {
      DevelopmentComp,
      VideoGallery,
      WorldMapVideos
    },
    data() {
      return {
        model: false
      }
    }
  }
</script>

<style scoped>
  .switch-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    width: fit-content;
    margin: auto;
    border: solid;
  }

  .switch-container > span {
    padding: 0 20px; /* Adds spacing around the text */
  }
</style>
