<template>
    <!-- Footer component using Vuetify -->
    <v-footer class="custom-footer" style="height: auto;">
      <v-row justify="center" no-gutters>
        <!-- Loops through list of shortcuts to make a button for each -->
        <v-btn
          v-for="link in links"
          :key="link"
          :to="link.path"
          color="white"
          variant="text"
          class="mx-2"
          rounded="xl"
        >
          {{ link.name }}
        </v-btn>


        <v-col class="text-center mt-4" cols="12" id="flex">
            <div id="item" v-for="item in platforms" :key="item.name">
            <!-- Use @click to handle the click event and open the link -->
            <font-awesome-icon
                :icon="['fab', item.icon]"
                size="xl"
                @click="openLink(item.url)"
                style="cursor: pointer;"
            />
            </div>
        </v-col>
        <!-- Copyright with name and year -->
        <v-col class="text-center mt-4" cols="12">
          &copy; {{ new Date().getFullYear() }} — <strong>Simulation Edge</strong>
        </v-col>
      </v-row>
    </v-footer>
  </template>

  <script>
    export default {
      data: () => ({
        links: [
          { path: '/', name: "Home"},
          { path: '/games', name: "Games"},
          { path: '/videos', name: "Videos"},
        ],
        platforms: [
          { icon: 'itch-io', name: "Itch.io", url: 'https://kristiangitar.itch.io/'},
          { icon: 'google-play', name: "Google Play", url: 'https://play.google.com/store/apps/developer?id=Simulation+Edge'},
          { icon: 'tiktok', name: "TikTok", url: 'https://www.tiktok.com/@kristian360s'},
          { icon: 'github', name: "Github", url: 'https://github.com/kristiangoystdal/SimulationEdge'},
        ],
      }),
    methods: {
        openLink(url) {
        if (url) {
            // Open the link only if the URL is provided
            window.open(url, '_blank');
        }
        },
    },
    }
  </script>

<style scoped>
    .custom-footer {
        background-color: #381C69; /* Your desired background color */
    }
    #flex{
        display: flex;
        justify-content: center;
    }
    #item{
        margin: 0 2vw;
    }
</style>