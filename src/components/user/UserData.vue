<template>
    <v-container style="max-width: 600px">
      <v-row>
        <v-col cols="200">
          <v-card>
            <v-card-title>
              <div class="headline">Profile</div>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="3">
                  <div class="caption">Username:</div>
                </v-col>
                <v-col cols="9">
                  <div v-if="!editing">{{ name || 'No username created' }}</div>
                  <v-text-field
                    v-else
                    v-model="name"
                    label="Username"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <div class="caption">E-mail:</div>
                </v-col>
                <v-col cols="9">
                  <div v-if="!editing">{{ email }}</div>
                  <v-text-field
                    v-else
                    v-model="email"
                    label="E-mail"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn
                v-if="!editing"
                color="primary"
                @click="toggleEdit"
              >
                Edit Profile
              </v-btn>
              <div v-else>
                <v-btn color="success" @click="saveChanges">Save Changes</v-btn>
                <v-btn color="error" @click="toggleEdit">Cancel</v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
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
          photoURL: 'https://example.com/jane-q-user/profile.jpg',
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
  @media (min-width: 769px) {
    /* Add any custom CSS for larger screens if needed */
  }
  
  @media (max-width: 768px) {
    /* Add any custom CSS for smaller screens if needed */
  }
  </style>
  