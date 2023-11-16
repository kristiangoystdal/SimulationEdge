<template>
    <TitleVue :title="pageTitle"></TitleVue>

    <div id="gallery">
      <v-container>
        <v-row>
          <v-col v-for="(item, index) in slideData" :key="index" cols="12" sm="6" md="4" lg="3">
            <v-sheet>
              <v-img
                v-if="!item.videoVisible"
                :src="item.image"
                :alt="item.name"
                @click="toggleMedia(index)"
                aspect-ratio="16/9"
                cover
              >
                <v-icon v-if="!item.videoVisible" class="play-button">mdi-play-circle-outline</v-icon>
              </v-img>

              <video
                v-if="item.videoVisible"
                :src="item.video"
                :autoplay="item.videoVisible"
                controls
                loop
                @click="toggleMedia(index)"
                ref="videoPlayer{{ index }}"
              >
                Your browser does not support the video tag.
              </video>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <br><br>
    {{ mobile }}
  </template>
  
  <script>
  import TitleVue from '../extra/Title.vue';
  
  // import LofotenImage from '../../assets/photos/Lofoten.png';
  // import LofotenVideo from '../../assets/videos/Lofoten.mp4';
  import AreImage from '../../assets/photos/Åre.png';
  import AreVideo from '../../assets/videos/Åre.mp4';
  import TrehytteImage from '../../assets/photos/Trehytte.png';
  import TrehytteVideo from '../../assets/videos/Trehytte.mp4';
  // import USAImage from '../../assets/photos/USA Roadtrip.png';
  // import USAVideo from '../../assets/videos/USA.mp4';
  
  export default {
    name: 'VideoGallery',
    data() {
      const slideData = [
        // { name: 'Lofoten', image: LofotenImage, video: LofotenVideo },
        { name: 'Åre', image: AreImage, video: AreVideo, videoVisible: false},
        // { name: 'Roadtrip i USA', image: USAImage, video: USAVideo },
        { name: 'Trehyttetur', image: TrehytteImage, video: TrehytteVideo, videoVisible: false},
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
      toggleMedia(index) {
        const item = this.slideData[index];
        for(var i = 0; i<this.slideData.length; i++){
          this.slideData[i] = { ...this.slideData[i], videoVisible: false};
        }
        if (item) {
          // Directly modify the array
          this.slideData[index] = { ...item, videoVisible: !item.videoVisible };

          // Access the video element by ref
          const videoElement = this.$refs[`videoPlayer${index}`];

          if (videoElement) {
            if (item.videoVisible) {
              videoElement.play();
            } else {
              videoElement.pause();
            }
          }

          // // Trigger a re-render
          // this.$forceUpdate();
        } else {
          console.error(`Item at index ${index} is undefined.`);
        }
      },
      playVideo(index) {
        if (this.videoPlaying) {
          this.stopVideo();
        } else {
          if(!this.mobile)
          {
            this.videoPlaying = true;
          }
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
    computed:{
      mobile(){
        if(innerWidth<769){
          return true
        }
        else{
          return false
        }
      }
      
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

  .play-button {
    font-size: 3em;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  
  @media(min-width: 769px){
    #gallery {
      max-width: 900px;
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
  }

  @media(max-width: 768px){
    #gallery {
      max-width: 900px;
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
    video{
      width: 100%;
      height: 100%;
    }
  }
  
  </style>
  