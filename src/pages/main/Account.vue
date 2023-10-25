<template>
  <!-- <UserData></UserData> -->
  <SignOut></SignOut>
</template>
  
  <script>
    import SignOut from '../../components/user/SignOut.vue'
    import UserData from '../../components/user/UserData.vue'

    export default{
      name: "AccountPage", 
      components: {
        SignOut, UserData,
      }
    }
  </script>
  
  <style scoped>


  </style>
  