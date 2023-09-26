<template>  
    <div id="box">
        <div id="left">
            <div id="profile-photo">
                <img v-show="photoUrl!=null" :src="photoUrl" alt="ProfilePic">
                <img v-show="photoUrl==null" src="../assets/photos/blank_user_photo.png" alt="ProfilePic">
            </div>
        </div>
        <div id="right">
            <div id="profile-username">
                <div id="label">Username: </div>
                <div v-if="!editting">
                    <div v-if="name!=null"> {{ name }}</div>
                    <div v-else>No username created</div>
                </div>
                <div v-else id="editBox">
                    <input type="text" name="" id="username" :placeholder='name'>
                </div>

            </div>
            <div id="profile-email">
                <div id="label">E-mail: </div>
                <div v-if="!editting">
                    <div>{{ email }}</div>
                </div>
                <div v-else id="editBox">
                    <input type="text" name="" id="email" :placeholder='email'>
                </div>
            </div>
            <div id="edit">
                <input v-if="!editting" type="submit" id="editButton" value="Edit Profile" @click="toggleEdit">
                <div v-else>
                    <input type="submit" id="saveButton" value="Save Changes" @click="saveChanges">
                    <input type="submit" id="cancelButton" value="Cancel" @click="toggleEdit">
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
    import { mapActions } from 'vuex';
    import { getAuth, onAuthStateChanged, updateEmail, updateProfile } from '@firebase/auth';

    export default{
        ...mapActions(['setUser']),
        name: "UserData", 
        data(){
            return{
                name: '',
                email: '',
                photoUrl: '',
                editting: false,
            }
        },
        methods:{
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
                } 
                else {
                    this.$emit('user', null);
                    this.setUser(null);
                }
            });
            },
            toggleEdit(){
                this.editting = !this.editting;
            },
            saveChanges(){
                const auth = getAuth();
                const newUsername = document.getElementById('username')
                const newEmail = document.getElementById('email')
                updateEmail(auth.currentUser, newEmail).then(() => {
                    console.log("Email Updated")
                })
                .catch((error) => {
                    alert(error)
                // ...
                });
                updateProfile(auth.currentUser, {
                    displayName: newUsername, photoURL: "https://example.com/jane-q-user/profile.jpg"
                }).then(() => {
                    console.log("Profile Updated")
                }).catch((error) => {
                    alert(error)
                });
            }
        },
        created() {
            this.observeAuthState();
        },
        components: {

        },
    
    }
</script>
    
<style scoped>
    @media (min-width: 769px){
        #box{
            margin: auto;
            padding: 1vw;
            width: 50vw;
            height: auto;

            border-radius: 1vw;
            background-color: #ac19e1;
            display: flex;
            color: white;
        }

        #left{
            width: 40%;
            height: 100%;
        }
        #right{
            width: 60%;
            margin: auto;
        }

        #profile-photo{
            width: 10vw;
            height: 10vw;
            display: flex;
            justify-content: center;
            padding: 2vw;
        }
        img{
            border-radius: 50%;
            width: 100%;
            height: 100%;
            margin: auto;
        }

        #profile-username, #profile-email{
            display: flex;
            justify-content: space-between;
            width: 23vw;
            height: 1.5vw;
            margin-top: 1vw;
            font-size: 1.5vw;
            border: solid;
        }

        #editButton, #saveButton, #cancelButton{
            width: auto;
            height: auto;
            margin-top: 1vw;
            margin-right: 1vw;
            font-size: 1.2vw;
        }

        #email, #username{
            width: 60%;
            font-size: auto;
            height: auto;
            
        }
    }

    @media (max-width: 768px){
        #box{
            margin: auto;
            padding: 1vw;
            width: 80vw;
            height: auto;

            border-radius: 2vw;
            background-color: #ac19e1;
            display: flex;
            color: white;
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            justify-items: center;
        }

        #left, #right{
            width: 100%;
            height: 100%;
            text-align: center;
        }

        #profile-photo{
            width: 70%;
            height: auto;
            display: flex;
            justify-content: center;
            align-self: center;
            margin: 10vw auto;
            border: solid;
            border-color: black;
            border-radius: 50%;
        }
        img{
            border-radius: 50%;
            width: 100%;
            height: 100%;
            margin: auto;
        }

        #profile-username, #profile-email{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 90%;
            height: 6vw;
            margin: 2vw auto;
            font-size: 5vw;
            align-items: center;
        }

        #editButton, #saveButton, #cancelButton{
            width: auto;
            height: auto;
            margin-top: 1vw;
            margin-right: 1vw;
            padding: 2vw;
            font-size: 4vw;
        }

        #email, #username{
            width: 100%;
            font-size: 3vw;
            text-align: right;
            height: 100%;
            padding: 0;
            margin: 0;
        }
        
        #editBox{
            width: 65%;
            height: 100%;
        }
    }
  


</style>
    