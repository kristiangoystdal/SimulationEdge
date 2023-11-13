<template>
  <UserData></UserData>
  <UserTools></UserTools>
  <SignOut></SignOut>
</template>
  
  <script>
    import SignOut from '../../components/user/SignOut.vue'
    import UserData from '../../components/user/UserData.vue'
    import UserTools from '../../components/user/UserTools.vue';

    export default{
      name: "AccountPage", 
      components: {
    SignOut, UserData, UserTools,
    UserTools
}
    }
  </script>
  
  <style scoped>


  </style>
  