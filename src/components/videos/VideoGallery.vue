<template>
    <TitleVue :title="pageTitle"></TitleVue>
  
    <div id="gallery" v-if="!videoPlaying">
        <v-carousel :cycle="!videoPlaying" hide-delimiter-background show-arrows="hover" class="carousel">
            <v-carousel-item v-for="(slide, i) in slideData" :key="i" @click="playVideo(i)">
                <v-sheet >
                <v-img :src="slide.image" :aspect-ratio="16/9" cover>
                    <div class="text-h2" @click.stop="playVideo(i)">
                    {{ !videoPlaying ? slide.name : '' }}
                    <v-icon v-if="!videoPlaying" class="play-button" @click.stop="playVideo(i)">mdi-play-circle-outline</v-icon>
                    </div>
                </v-img>
                </v-sheet>
            </v-carousel-item>
        </v-carousel>
    </div>
    
    <div id="gallery" v-if="videoPlaying">
      <video controls autoplay ref="videoPlayer" class="video-player" @click.stop="toggleVideo">
        <source :src="currentVideo" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
  </template>
  
  <script>
  import TitleVue from '../extra/Title.vue';
  
  import LofotenImage from '../../assets/photos/Lofoten.png';
  import LofotenVideo from '../../assets/videos/Lofoten.mp4';
  import AreImage from '../../assets/photos/Åre.png';
  import AreVideo from '../../assets/videos/Åre.mp4';
  import TrehytteImage from '../../assets/photos/Trehytte.png';
  import TrehytteVideo from '../../assets/videos/Trehytte.mp4';
  import USAImage from '../../assets/photos/USA Roadtrip.png';
  import USAVideo from '../../assets/videos/USA.mp4';
  
  export default {
    name: 'VideoGallery',
    data() {
      const slideData = [
        { name: 'Lofoten', image: LofotenImage, video: LofotenVideo },
        { name: 'Åre', image: AreImage, video: AreVideo },
        { name: 'Roadtrip i USA', image: USAImage, video: USAVideo },
        { name: 'Trehyttetur', image: TrehytteImage, video: TrehytteVideo },
      ];
  
      return {
        pageTitle: 'Videos',
        slideData: slideData,
        videoPlaying: false,
        currentVideo: null,
        activeVideoIndex: null,
      };
    },
    components: {
      TitleVue,
    },
    methods: {
      playVideo(index) {
        if (this.videoPlaying) {
          this.stopVideo();
        } else {
          this.videoPlaying = true;
          this.activeVideoIndex = index;
          this.currentVideo = this.slideData[index].video;
          this.$nextTick(() => {
            if (this.$refs.videoPlayer) {
              this.$refs.videoPlayer.play();
            }
          });
        }
      },
      stopVideo() {
        if (this.videoPlaying) {
          this.videoPlaying = false;
          this.$nextTick(() => {
            if (this.$refs.videoPlayer) {
              this.$refs.videoPlayer.pause();
            }
          });
        }
      },
      toggleVideo() {
        if (this.videoPlaying) {
          this.stopVideo();
        } else if (this.activeVideoIndex !== null) {
          this.playVideo(this.activeVideoIndex);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  @font-face {
    font-family: 'TitleFont';
    font-display: auto;
    font-weight: 400;
    font-style: normal;
    src: url('../../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
  }
  
  #gallery {
    max-width: 1000px;
    width: 90%;
    height: auto;
    border: solid;
    margin: auto;
  }
  
  .carousel{
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: black;
  }
  
  .text-h2 {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-align: center;
    font-size: 10vw;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    font-family: 'TitleFont', sans-serif;
    cursor: pointer;
  }
  
  .play-button {
    position: absolute;
    top: 150%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4vw;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
  }
  
  .play-button:hover {
    color: white;
  }
  
  .video-player {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: black;
  }
  </style>
  