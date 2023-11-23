<template>
  <div class="user-card">
      <v-card-title>
        Account
      </v-card-title>
      <v-card-content >
        <div v-if="!editing" id="databox">
          <div id="label">
            <p><strong>Username:</strong> {{ userData.username }}</p>
          </div>
          <div id="label">
            <p><strong >Email:</strong> {{ userData.email }}</p>
          </div>
          <div id="label" >
            <p style="display: flex; align-items: center;">
              <strong >Verified:</strong> 
              <v-icon v-if="verifiedEmail" icon="mdi-check-circle" size="small"></v-icon>
              <v-icon v-if="!verifiedEmail" icon="mdi-close-circle" size="small"></v-icon>
            </p>
          </div>
        
          <br>
          <v-btn
            block
            color=""
            size="large"
            type="submit"
            variant="elevated"
            @click="toggleEditing"
            >
            Edit User
          </v-btn>
        </div>

        <v-form
          v-model="form"
          @submit.prevent="onSubmit"
          v-else
          id="databox"
        >
          <!-- Username Input Field -->
          <v-text-field
          v-model="editedData.username"
          :readonly="loading"
          :rules="editedData.username ? [rules.noSpaces]: []"
          clearable
          label="Username"
          :placeholder="userData.username"
          >
          </v-text-field>

          <!-- E-mail Input field -->
          <v-text-field
          v-model="editedData.email"
          :rules="editedData.email ? [rules.email] : []"
          class="mb-2"
          clearable
          label="Email"
          :placeholder="userData.email"
          ></v-text-field>


          <br>

          <v-btn
            :disabled="!form || (editedData.email === '' && editedData.username === '')"      
            :loading="loading"
            block
            color="success"
            size="large"
            type="submit"
            variant="elevated"
            @click="saveChanges"
          >
            Save Changes
          </v-btn>
          <br>
          <v-btn
            block
            color=""
            size="large"
            type="submit"
            variant="elevated"
            @click="toggleEditing"
          >
            Cancel
          </v-btn>
        </v-form>
        <br>
      </v-card-content>
  </div>
</template>

<script>
import {
    getAuth,
    updateProfile,
    onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, onValue, set, remove, get} from 'firebase/database';

const db = getDatabase(); 
const auth = getAuth();

export default {
  data() {
    return {
      userData: {
        username: '', // Initialize with user data from Firebase
        email: '',    // Initialize with user data from Firebase
      },
      editedData: {
        username: '',
        email: '',
      },
      editing: false,
      loading: false,
      form: false,
      rules:{
        noSpaces: (value) => {
          if (/\s/.test(value)) {
            return "Username cannot contain spaces";
          }
          return true;
        },
        required: value => !!value || 'Field is required',
        min: value => value.length >= 8 || 'Password must be min 8 characters',
        digit: value => (/\d/.test(value)) || 'Password must include a number',
        capital: value => (/[A-Z]/.test(value)) || 'Password must include a capital letter',
        email: value => (/.+@.+\..+/.test(value)) || 'Email must be valid',
        passwordmatch: value => value==this.password1 || "Password doesn't match",
      },
      verified: false,
    };
  },
  created(){
    onAuthStateChanged(auth, (user) => {
        this.userData.username = user.displayName;
        this.userData.email = user.email;
        this.verified = user.emailVerified;
    });
  },
  methods: {
    toggleEditing() {
      this.editing = !this.editing;
      if (this.editing) {
        this.editedData.username = "";
        this.editedData.email = "";
      }
    },

    // Define the function to update the username
    saveChanges() {

      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
      // Reference to the Firebase Realtime Database
      const db = getDatabase();
      const usernameRef = ref(db, `/username`);
      
      // New username and user ID
      var newUsername = this.editedData.username;
      if (!this.editedData.username) {
        newUsername = this.userData.username;
        console.log(newUsername);
      }
      const userId = auth.currentUser.uid;

      // Check if the new username is already taken
      get(usernameRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const usernameData = snapshot.val();

            // Check if the new username already exists
            if (Object.values(usernameData).includes(newUsername)) {
              alert('Username is already taken. Please choose another.');
            } else {
              // Update the user's profile first
              updateProfile(auth.currentUser, {
                displayName: newUsername,
                photoURL: ""
              })
                .then(() => {
                  // Remove the old reference (if it exists)
                  if (this.userData.username) {
                    remove(ref(db, `/username/${this.userData.username}`));
                  }

                  // Set the new reference with user ID as the key
                  set(ref(db, `/username/${userId}`), newUsername)
                    .then(() => {
                      // Update the user data
                      this.userData.username = newUsername;
                      this.userData.email = auth.currentUser.email;
                      this.toggleEditing();
                    })
                    .catch((error) => {
                      alert(error);
                    });
                })
                .catch((error) => {
                  alert(error);
                });
            }
          } else {
            alert('Error in checking username availability.');
          }
        })
        .catch((error) => {
          alert(error);
        });
    }




  },
  computed: {
    verifiedEmail(){
      return auth.currentUser.emailVerified;
    },
  }
};
</script>

<style scoped>

.user-card {
  margin: 1vw auto;
  padding: 10px;
  max-width: 600px;
  width: 90%;
  border: solid;
  background-color: bisque;
  border-radius: 20px;
}
#editBox{
  width: 100px;
  height: 10px;
  margin: auto;
}
#databox{
  width: 90%;
  margin: auto;
}
.flex{
  display: flex;
}
#button{
  border: solid;
  font-size: auto;
  height: auto;
  width: 20%;
  margin: 0.5vw 0.5vw;
  padding: 0.5vw;
  background-color:white;
  border-radius: 15px;
  text-align: center;
  font-family: 'TitleFont';
  cursor: pointer;
}
/* v-button{
  width: 100%;
  height: 100%;
} */
</style>
