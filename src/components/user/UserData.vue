<template>
  <v-container fluid>
      <v-layout column>
          <v-card>
              <v-card-text>
                  <v-flex class="mb-4">
                      <v-avatar size="96" class="mr-4">
                          <img :src="'/avatars/avatar_' + (form.avatar.toLowerCase()) + '.png'" alt="Avatar">
                      </v-avatar>
                      <v-btn @click="openAvatarPicker">Change Avatar</v-btn>
                  </v-flex>
                  <v-text-field
                      v-model="form.firstName"
                      label="FirstName"></v-text-field>
                  <v-text-field
                      v-model="form.lastName"
                      label="Last Name"></v-text-field>
                  <v-text-field
                      v-model="form.contactEmail"
                      label="Email Address"></v-text-field>
              </v-card-text>
              <v-card-actions>
                  <v-btn color="primary" :loading="loading" @click.native="update">
                      <v-icon left dark>check</v-icon>
                      Save Changes
                  </v-btn>
              </v-card-actions>
          </v-card>
      </v-layout>
      <avatar-picker
          v-model="showAvatarPicker"
          :current-avatar="form.avatar"
          @selected="selectAvatar"></avatar-picker>
  </v-container>
</template>
  
  <script>
  import { mapActions } from 'vuex';
  import { getAuth, onAuthStateChanged, updateEmail, updateProfile } from '@firebase/auth';
  
  export default {
    ...mapActions(['setUser']),
    name: 'UserData',
    data() {
      return {
        name: '',
        email: '',
        photoUrl: '',
        editing: false,
      };
    },
    methods: {
      ...mapActions(['setUser']),
      observeAuthState() {
        const auth = getAuth();
  
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.$emit('user', user);
            this.setUser(user);
  
            this.name = user.displayName;
            this.email = user.email;
            this.photoUrl = user.photoURL;
          } else {
            this.$emit('user', null);
            this.setUser(null);
          }
        });
      },
      toggleEdit() {
        this.editing = !this.editing;
      },
      saveChanges() {
        const auth = getAuth();
        updateEmail(auth.currentUser, this.email)
          .then(() => {
            this.toggleEdit();
          })
          .catch((error) => {
            alert(error);
          });
  
        updateProfile(auth.currentUser, {
          displayName: this.name,
        })
          .then(() => {
            console.log('Profile Updated');
          })
          .catch((error) => {
            alert(error);
          });
      },
    },
    created() {
      this.observeAuthState();
    },
  };
  </script>
  
  <style scoped>

  .border{
    border: solid;
  }
  
  .center{
    margin: auto;
    text-align: center;
  }
  @media (min-width: 769px) {
    /* Add any custom CSS for larger screens if needed */
  }
  
  @media (max-width: 768px) {
    /* Add any custom CSS for smaller screens if needed */
  }
  </style>
  