<template> 
  <div id="box">
    <div id="toolTitle">User Tools</div>
    <div id="toolsList">
      <div id="tool" v-if="!verifiedEmail">
        <v-btn @click="sendMail">
          Verify e-mail
        </v-btn>
      </div>
      <div id="tool">
        <v-btn @click="passwordReset">Reset Password</v-btn>
      </div>
    </div>
    
    
    

    
  </div>
</template>

<script>

import {
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail, 
  
} from "firebase/auth";

const auth = getAuth();
const currentUser = auth.currentUser;

export default {
  name: 'UserTools',
  data() {
      return {

      };
  },
  components: {
  },
  computed:{
    user() {
      return this.$store.getters.getCurrUser;
    },
    verifiedEmail(){
      return auth.currentUser.emailVerified;
    }
  },
  methods:{
    sendMail(){
      sendEmailVerification(currentUser);
    },
    passwordReset(){
      sendPasswordResetEmail(auth, currentUser.email);
    }
  }
}
</script>

<style scoped>
  #box{
    margin: 1vw auto;
  padding: 10px;
  max-width: 600px;
  border: solid;
  background-color: bisque;
  border-radius: 20px;
  }
  #toolTitle{
    /* border-bottom: solid; */
    margin: 0.5vw auto;
    font-size: 1.5vw;
    font-family: 'TitleFont';
    text-decoration: underline;

  }
  #toolsList{
    display: flex;
  }
  #tool{
    margin: auto;
  }
</style>
