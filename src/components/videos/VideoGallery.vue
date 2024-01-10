<template>
  <TitleVue :title="pageTitle"></TitleVue>

  <div id="gallery">
    <v-container>
      <v-row>
        <v-col
          v-for="(item, index) in slideData"
          :key="index"
          :cols="mobile ? 12 : 6"
          sm="6"
          md="6"
          lg="6"
        >
          <video
            :key="index"
            :poster="item.image"
            :src="item.video"
            :ref="`videoPlayer${index}`"
            controls
            @play="playVideo(index)"
            @pause="stopVideo(index)"
          >
            Your browser does not support the video tag.
          </video>
          <div id="videoName">
            <h3>{{ item.name }}</h3>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <br /><br />
</template>

<script>
import TitleVue from '../extra/Title.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from 'firebase/database';

const auth = getAuth();
const db = getDatabase();

import AreImage from '../../assets/photos/Åre.png';
import AreVideo from '../../assets/videos/Åre.mp4';
import TrehytteImage from '../../assets/photos/Trehytte.png';
import TrehytteVideo from '../../assets/videos/Trehytte.mp4';
import USAImage from '../../assets/photos/USA Roadtrip.png';
import USAVideo from '../../assets/videos/USA.mp4';
import LofotenImage from '../../assets/photos/Lofoten.png';
import LofotenVideo from '../../assets/videos/Lofoten.mp4';
import BrusselImage from '../../assets/photos/Brussel.jpg';
import BrusselVideo from '../../assets/videos/Brussel.mov';

export default {
  name: 'VideoGallery',
  data() {
    const slideData = [
      { name: 'Åre', image: AreImage, video: AreVideo, private: false},
      { name: 'Trehyttetur', image: TrehytteImage, video: TrehytteVideo, private: false},
      { name: 'USA', image: USAImage, video: USAVideo, private: true},
      { name: 'Lofoten', image: LofotenImage, video: LofotenVideo, private: true},
      { name: 'Brussel', image: BrusselImage, video: BrusselVideo, private: false},
    ];

    return {
      pageTitle: 'Videos',
      slideData: slideData,
      activeVideoIndex: null,
    };
  },
  components: {
    TitleVue,
  },
  computed: {
    mobile() {
      return innerWidth < 769;
    },
  },
  methods: {
    playVideo(index) {
      if (this.activeVideoIndex !== null && this.activeVideoIndex !== index) {
        this.stopVideo(this.activeVideoIndex);
      }
      this.activeVideoIndex = index;
    },
    stopVideo(index) {
      if (index !== null) {
        const videoElement = this.$refs[`videoPlayer${index}`][0];
        if (videoElement && typeof videoElement.pause === 'function' && !videoElement.paused) {
          videoElement.pause();
        }
        this.activeVideoIndex = null;
      }
    },
    async checkPrivateVideos(user) {
      try {
        if(user){
          //Shows the private videos to users with a verified email
          if(auth.currentUser.emailVerified){
            this.slideData = this.slideData;
          }
          //Shows the private videos to users that are on a private list
          else{
            // Assuming you have a node named 'userPrivateVids' with user-specific private video names
            const privateVidsRef = ref(db, `usersPrivateVids`);

            onValue(privateVidsRef, (snapshot) => {
              const allowedVideoNames = snapshot.val() || {};

              // Check if the specific key (user) exists in the snapshot
              if (allowedVideoNames[user.uid]) {
                // If the key exists, show all videos (private and non-private)
                this.slideData = this.slideData;
              } else {
                // If the key doesn't exist, filter out all private videos
                this.slideData = this.slideData.filter((video) => !video.private);
              }
            });
          }          
        }
        else{
          this.slideData = this.slideData.filter((video) => !video.private);
        }
        
      } catch (error) {
        console.error('Error checking private videos:', error);
      }
    },
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.checkPrivateVideos(user);
    });
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
  max-width: 1200px;
  width: 90%;
  height: auto;
  margin: auto;
}

video {
  width: 100%;
  height: auto;
}



@media (min-width: 769px) {
  #videoName{
    text-align: center;
    font-size: 1.6vw;
    padding-bottom: 5vw;
    font-family: "Titlefont";
    font-style: oblique;
  }
}

@media (max-width: 768px) {
  #videoName{
    text-align: center;
    font-size: 5vw;
    padding-bottom: 5vw;
  }
}
</style>
