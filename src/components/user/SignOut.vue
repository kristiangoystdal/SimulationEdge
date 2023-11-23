<template> 
    <div id="logout-box">
      <input type="submit" id="logOut" name="logOut" value="Log Out" @click="logOut">
    </div>
</template>
    
<script>
    import { getAuth, signOut} from "firebase/auth"
    export default{
        name: "SignOutComp", 
        components: {

        },
        methods:{
            logOut(){
                signOut(getAuth())
                .then(()=>{
                    console.log('Logged Out')
                    this.$router.push('/');
                })
            }
        },
        computed: {
          user() {
            return this.$store.getters.getCurrUser;
          },
        },
    }
</script>
    
<style scoped>

  @media (min-width: 769px){
    #logOut{
      width: 15vw;
      height: 4vw;
      background-color: aliceblue;
      margin: auto;
    }

    #logout-box{
      border-radius: 1vw; 
      width: auto;
      height: auto;
      margin: auto;
      margin-top: 5vw;
      justify-content: center;
      display: flex;
    }
  }

  @media (max-width: 768px){
    #logOut{
      width: 15vw;
      height: 7vw;
      background-color: white;
      margin: auto;
      font-size: auto;
      border-radius: 1vw;
      border:#ac19e1;
    }

    #logout-box{
      border-radius: 1vw; 
      width: 30vw;
      height: 10vw;
      margin: auto;
      margin-top: 3vw;
      justify-content: center;
      display: flex;
    }
  }
  
  
</style>
    