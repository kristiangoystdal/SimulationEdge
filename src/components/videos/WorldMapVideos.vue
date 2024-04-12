<template>
  <div>
    <TitleVue :title="pageTitle"></TitleVue>
    <div id="map" style="height: 400px"></div>

    <div id="gallery">
      <v-container>
        <v-row>
          <v-col
            v-for="(item, index) in galleryItems"
            :key="`gallery-item-${index}`"
            cols="6"
            sm="6"
            md="3"
          >
            <img
              :src="item.image"
              @click="openVideo(item.video)"
              alt=""
              class="gallery-image"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div v-if="isVisible" class="overlay" @click="overlayClick">
      <div class="video-container">
        <video :src="selectedVideo" controls autoplay></video>
        <button class="close-btn" @click="hide">
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import markerIcon from '../../assets/photos/marker-icon.png'
  import TitleVue from '../extra/Title.vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  import AreImage from '../../assets/photos/Åre.png'
  import AreVideo from '../../assets/videos/Åre.mp4'
  import TrehytteImage from '../../assets/photos/Trehytte.png'
  import TrehytteVideo from '../../assets/videos/Trehytte.mp4'
  import USAImage from '../../assets/photos/USA Roadtrip.png'
  import USAVideo from '../../assets/videos/USA.mp4'
  import LofotenImage from '../../assets/photos/Lofoten.png'
  import LofotenVideo from '../../assets/videos/Lofoten.mp4'
  import BrusselImage from '../../assets/photos/Brussel.jpg'
  import BrusselVideo from '../../assets/videos/Brussel.mov'
  import Åre24Image from '../../assets/photos/Åre_2024.jpg'
  import Åre24Video from '../../assets/videos/Åre_2024.mp4'
  import SveitsItaliaImage from '../../assets/photos/SveitsItalia.jpg'
  import SveitsItaliaVideo from '../../assets/videos/Sveits-Italia.mov'

  export default {
    name: 'VideoGallery',
    components: {
      FontAwesomeIcon,
      TitleVue
    },
    data() {
      return {
        pageTitle: 'Videos',
        map: null,
        tileLayer: null,
        locationSelected: false,
        isVisible: false,
        selectedVideo: null,
        locations: [
          {
            id: 1,
            name: 'Åre',
            images: [AreImage, Åre24Image],
            videos: [AreVideo, Åre24Video],
            coords: [63.3993, 13.0797]
          },
          {
            id: 2,
            name: 'Trehyttetur',
            images: [TrehytteImage],
            videos: [TrehytteVideo],
            coords: [60.757, 11.0342]
          },
          {
            id: 3,
            name: 'USA Roadtrip',
            images: [USAImage],
            videos: [USAVideo],
            coords: [36.7783, -119.4179]
          },
          {
            id: 4,
            name: 'Lofoten',
            images: [LofotenImage],
            videos: [LofotenVideo],
            coords: [68.1342, 13.8596]
          },
          {
            id: 5,
            name: 'Brussel',
            images: [BrusselImage],
            videos: [BrusselVideo],
            coords: [50.8503, 4.3517]
          },
          {
            id: 7,
            name: 'Sveits & Italia',
            images: [SveitsItaliaImage],
            videos: [SveitsItaliaVideo],
            coords: [41.8719, 12.5674]
          }
        ],
        galleryItems: []
      }
    },
    mounted() {
      this.initMap()
      this.addMarkers()
      this.flattenGalleryItems()

      window.addEventListener('open-video', event => {
        this.selectedVideo = event.detail // The video URL passed from the button click
        this.show()
      })
    },
    beforeDestroy() {
      window.removeEventListener('open-video', this.handleOpenVideo)
    },
    methods: {
      initMap() {
        this.map = L.map('map', {
          center: [47.41322, -1.219482],
          zoom: 2,
          minZoom: 2,
          maxZoom: 4,
          maxBounds: [
            [-90, -180],
            [90, 180]
          ],
          maxBoundsViscosity: 1.0
        })

        this.tileLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution: '',
            noWrap: true
          }
        )

        this.tileLayer.addTo(this.map)
      },
      addMarkers() {
        // Define the custom icon
        const customIcon = L.icon({
          iconUrl: markerIcon, // Adjust the path to your marker icon
          iconSize: [25, 41], // Size of the icon
          iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
          popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
          shadowSize: [41, 41] // Size of the shadow
        })

        this.locations.forEach(location => {
          // Start the grid container for images with display: grid; and define the grid template to have two columns
          let imagesGridHtml =
            '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">'

          // Generating HTML for each image and adding them to the grid
          imagesGridHtml += location.images
            .map(
              (image, index) =>
                `<div style="width: 200px; height: auto; text-align: center; margin: auto;">
                      <img src="${image}" alt="${location.name}" style="width: 100%; height: auto; cursor: pointer;" onclick="window.dispatchEvent(new CustomEvent('open-video', { detail: '${location.videos[index]}' }))" />
                  </div>`
            )
            .join('')

          // Close the grid container
          imagesGridHtml += '</div>'

          // Include the location name and the grid of images in the popup content
          const popupContent = `
              <div style="text-align: center; margin-bottom: 10px;">
                  <strong>${location.name}</strong>
              </div>
              ${imagesGridHtml}
          `

          // Creating the marker with the custom icon and binding the popup with the content
          L.marker(location.coords, { icon: customIcon })
            .addTo(this.map)
            .bindPopup(popupContent, { maxWidth: 420 }) // Adjust maxWidth to accommodate 2 images side by side including the gap
        })
      },

      handleOpenVideo(event) {
        // This method will be triggered when an image is clicked
        this.selectedVideo = event.detail // The video URL passed from the button click
        this.show()
      },
      openVideo(videoUrl) {
        this.selectedVideo = videoUrl
        this.show()
      },
      overlayClick(event) {
        // Check if the click is outside the video container
        if (event.target.classList.contains('overlay')) {
          this.hide()
        }
      },
      show() {
        this.isVisible = true
      },
      hide() {
        this.isVisible = false
        this.selectedVideo = null // Clear the video source
      },
      flattenGalleryItems() {
        this.galleryItems = this.locations.flatMap(location =>
          location.images.map((image, index) => ({
            image: image,
            video: location.videos[index] || ''
          }))
        )
      }
    }
  }
</script>

<style scoped>
  .images-flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* Adjust gap between images */
  }

  .flex-image {
    flex: 1 0 auto;
    max-width: 100%; /* Adjust based on desired number of images per row within a slot */
    height: auto;
    cursor: pointer;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure it overlays other content */
  }

  .video-container {
    position: relative;
    padding: 20px;
  }

  video {
    width: 80vw;
    max-width: 800px; /* Adjust based on your needs */
    height: auto;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px; /* Diameter of the circle */
    height: 30px; /* Diameter of the circle */
    padding: 5px;
    background: #fff; /* Background color of the circle */
    color: #333; /* Color of the icon/character */
    border: none;
    border-radius: 50%; /* Makes the button circular */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px; /* Adjust as needed */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Optional: Adds a drop shadow */
    z-index: 1001; /* Ensure it's above other content */
  }

  @font-face {
    font-family: 'TitleFont';
    font-display: auto;
    font-weight: 400;
    font-style: normal;
    src: url('../../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
  }

  video {
    width: 100%;
    height: auto;
  }

  img {
    width: 100%;
    height: auto;
  }

  #gallery {
    width: 1000px;
    max-width: 90%;
    margin: auto;
    padding-top: 5vw;
  }

  #map {
    border: solid;
    cursor: grab; /* Change cursor to indicate panning */
    /* Set the height for the map */
    height: 800px;
    max-width: 1000px;
    width: 90%;
    margin: auto;
    z-index: 1;
  }

  @media (min-width: 769px) {
    #videoName {
      text-align: center;
      font-size: 1.6vw;
      padding-bottom: 5vw;
      font-family: 'Titlefont';
      font-style: oblique;
    }

    #buttons {
      width: 1vw;
      height: 1vw;
      border-radius: 50%;
      background-color: white;
    }
  }

  @media (max-width: 768px) {
    #videoName {
      text-align: center;
      font-size: 5vw;
      padding-bottom: 5vw;
    }
  }
</style>
