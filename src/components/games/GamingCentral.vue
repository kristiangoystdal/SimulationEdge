<template>
    <TitleVue :title='pageTitle'></TitleVue>

    <div id="game">
        <div class="game-container">
            <iframe frameborder="0" src="https://itch.io/embed-upload/8869520?color=9308ba" allowfullscreen="" id="widget"></iframe>
        </div>
        <br>
        <div id="links">
            <v-btn
                color="primary"
                size="large"
                href="https://kristiangitar.itch.io/gaming-central"
                target="blank"
                id="mobile"
                class="custom-button"
            >
                <v-avatar size="30">
                    <img src="../../assets/photos/itch-logo.png" alt="Image Alt Text" />
                </v-avatar>
                Play on Itch.io
            </v-btn>
            <!-- <br> -->
            <v-btn 
                color="primary" 
                size="large" 
                href="https://play.google.com/store/apps/details?id=com.GamingEdge" 
                target="blank" 
                id="mobile"
                class="custom-button"
            >
                <v-avatar size="30">
                    <img src="../../assets/photos/Google-Play-Logo-solo.jpg" alt="Google Play Logo" />
                </v-avatar>
                <div>
                    Download at Google Play
                </div>
               
            </v-btn>
            
        </div>        
    </div>

</template>
  
<script>
    import TitleVue from '../extra/Title.vue';

    export default {
        name: 'GamingCentral',
        data() {
            return {
                pageTitle: "Gaming Central"
            };
        },
        components: {
            TitleVue
        },
    }
</script>

<style scoped>
    * {
        margin: 0;
        padding: 0;
    }

    img{
        width: 100%;
        height: 100%;
    }

    
    @media (min-width: 769px) {
        #game {
            margin: auto;
            justify-content: center;
            align-items: center;
            max-width: 970px;
            height: 70vh; /* Center vertically within the viewport */
        }
        .game-container {
            width: 100%;
            height: 0;
            padding-bottom: 70%; /* 16:9 aspect ratio for responsive iframe */
            position: relative;
        }
        #widget {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: scale(1); /* Adjust the scale value as needed */
            transform-origin: top left;
        }

        #links{
            margin: auto;
            width: 70%;
            height: fit-content;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
        }
    }

    @media (max-width: 768px) {
        #game {
            margin: auto;
            justify-content: center;
            align-items: center;
            padding: 10px;
            max-width: 1000px;
            height: auto; /* Center vertically within the viewport */
        }
        .game-container {
            width: 100%;
            height: 0;
            padding-bottom: 70%; /* 16:9 aspect ratio for responsive iframe */
            position: relative;
        }
        #widget {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: scale(1); /* Adjust the scale value as needed */
            transform-origin: top left;
        }

        #links{
            margin: auto;
            width: 90%;
            height: fit-content;
            align-items: center;
            padding: 10px;
        }
        #mobile{
            margin: 10px;
            display: flex;
            align-items: center;
        }
    }
    
</style>