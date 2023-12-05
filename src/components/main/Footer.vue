
<template>
    <v-footer class="custom-footer" style="height: auto;">
      <v-row justify="center" no-gutters>
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
      }),
    }
  </script>

<style scoped>
    .custom-footer {
        /* border-top: solid; */
        background-color: #2f2d91dc; /* Your desired background color */
    }
</style>