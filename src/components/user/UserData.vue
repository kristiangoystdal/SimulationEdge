<template>
  <div class="user-card">
    <v-card>
      <v-card-title>
        User Information
      </v-card-title>
      <v-card-content>
        <div v-if="!editing">
          <p><strong>Username:</strong> {{ userData.username }}</p>
          <p><strong>Email:</strong> {{ userData.email }}</p>
          <v-button @click="toggleEditing" v-if="!editing">Edit</v-button>
        </div>

        <div v-else>
          <v-text-field
            v-model="editedData.username"
            clearable
            label="Username"
            :placeholder="userData.username"
            id="editBox"
          >
          </v-text-field>
          <v-text-field
            v-model="editedData.email"
            clearable
            label="E-mail"
            :placeholder="userData.email"
            id="editBox"
          >
          </v-text-field>
          
          <v-button @click="saveChanges">Save</v-button>
          <v-button @click="toggleEditing">Cancel</v-button>
        </div>
      </v-card-content>
    </v-card>
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
    };
  },
  created(){
    onAuthStateChanged(auth, (user) => {
        this.userData.username = user.displayName;
        this.userData.email = user.email;
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

    // doesnt work... just deleteds everything in database
    
    // saveChanges() {
    //   const usernameRef = ref(db, `/username`);

    //   // Check if the new username is already taken
    //   const newUsername = this.editedData.username;
    //   const userId = auth.currentUser.uid;

    //   get(usernameRef)
    //     .then((snapshot) => {
    //       if (snapshot.exists() && snapshot.val()[newUsername]) {
    //         // The username is already taken; handle this case accordingly
    //         alert('Username is already taken. Please choose another.');
    //       } else {
    //         // Update the user's profile first
    //         updateProfile(auth.currentUser, {
    //           displayName: newUsername,
    //           photoURL: ""
    //         })
    //           .then(() => {
    //             // Remove the old reference (if it exists)
    //             if (this.userData.username) {
    //               remove(ref(db, `/username/${this.userData.username}`));
    //             }

    //             // Set the new reference
    //             set(ref(db, `/username/${newUsername}`), userId)
    //               .then(() => {
    //                 // Update the user data
    //                 this.userData.username = newUsername;
    //                 this.userData.email = auth.currentUser.email;
    //                 this.toggleEditing();
    //               })
    //               .catch((error) => {
    //                 alert(error);
    //               });
    //           })
    //           .catch((error) => {
    //             alert(error);
    //           });
    //       }
    //     })
    //     .catch((error) => {
    //       alert(error);
    //     });
    // }



  },
};
</script>

<style scoped>
.user-card {
  margin: 1vw auto;
  padding: 10px;
  max-width: 600px;
  color: red;
}
#editBox{
  width: 100px;
  margin: auto;
}
</style>
