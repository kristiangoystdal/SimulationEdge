<template> 
  <div id="box">
    <div id="toolTitle">User Tools</div>
    <div id="toolsList">
      <div id="tool" v-if="!verifiedEmail">
        <v-btn @click="sendMail" :disabled="sentVerifyMail" :loading="loading1">
          <div v-if="!sentVerifyMail">Verify e-mail</div>
          <div v-if="sentVerifyMail">Verify e-mail sent</div>
        </v-btn>
      </div>
      <div id="tool">
        <v-btn @click="passwordReset" :disabled="sentResetMail" :loading="loading2">
          <div v-if="!sentResetMail">Reset Password e-mail</div>
          <div v-if="sentResetMail">Reset e-mail sent</div>
        </v-btn>
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
        sentVerifyMail: false,
        sentResetMail: false,
        loading1: false,
        loading2: false,
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
      this.loading1 = true;

      setTimeout(() => (this.loading1 = false), 2000);

      sendEmailVerification(currentUser);

      this.sentVerifyMail = true;
    },
    passwordReset(){
      this.loading2 = true;

      setTimeout(() => (this.loading2 = false), 2000);

      sendPasswordResetEmail(auth, currentUser.email)
      .then(() => {
        // Password reset email sent successfully
        console.log("Password reset email sent!");
      })
      .catch((error) => {
        // Handle errors
        console.error("Error sending password reset email:", error.message);
      });

      this.sentResetMail = true;
    },
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
