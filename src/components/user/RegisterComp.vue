<template>

    <v-sheet class="sheet" style="max-width: 400px" id="center" rounded >
        <div id="register">Register</div>

        <v-form
            v-model="form"
            @submit.prevent="onSubmit"
            id="registerForm"
        >
            <!-- Username Input Field -->
            <v-text-field
            v-model="username"
            :readonly="loading"
            :rules="[rules.required]"
            clearable
            label="Username"
            placeholder="Enter your username"
            >
            </v-text-field>

            <!-- E-mail Input field -->
            <v-text-field
            v-model="email"
            :readonly="loading"
            :rules="[rules.required, rules.email]"
            class="mb-2"
            clearable
            label="Email"
            ></v-text-field>

            <!-- Password Input field -->
            <v-text-field
            v-model="password1"
            :readonly="loading"
            :rules="[rules.required, rules.min, rules.digit, rules.capital]"
            clearable
            label="Password"
            placeholder="Enter your password"
            hint="Must include a number, a capital letter and min 8 characters"
            :type="show1 ? 'text' : 'password'"
            :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"     
            @click:append-inner="show1=!show1"
            >
            </v-text-field>

            <!-- Second Password Input field -->
            <v-text-field
            v-model="password2"
            :readonly="loading"
            :rules="[rules.required, rules.passwordmatch]"
            clearable
            label="Repeat Password"
            placeholder="Enter your password"
            :type="show2 ? 'text' : 'password'"
            :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"     
            @click:append-inner="show2=!show2"
            >
            </v-text-field>

            <br>

            <v-btn
            :disabled="!form"
            :loading="loading"
            block
            color="success"
            size="large"
            type="submit"
            variant="elevated"
            @click="register"
            >
            Sign Up
            </v-btn>
        </v-form>
        <br>
        <!-- Login link -->
        <div id="link">
            <router-link to="/login">Login here</router-link>
        </div>

        <br><br>
        
        
    </v-sheet>
    
</template>
  
<script>
    import {
        getAuth,
        createUserWithEmailAndPassword,
        setPersistence,
        browserLocalPersistence,
        updateProfile,
    } from "firebase/auth";
    import { mapActions } from 'vuex';
    import { getDatabase, ref, onValue, set, remove} from 'firebase/database';

    const db = getDatabase();
    
    export default {
        components: {
            // Password,
        },
        methods: {
            ...mapActions(['setUser']),
            
            // Handle registration
            register() {
                if (!this.form) return;

                this.loading = true;

                setTimeout(() => (this.loading = false), 2000);

                const email_signin = this.email;
                const password_signin = this.password1;
                const username = this.username;

                const auth = getAuth();

                // Check if the username is already taken
                const usernameRef = ref(db, `/username/${username}`);
                console.log(usernameRef);
                onValue(usernameRef, (snapshot)=>{
                    if (snapshot.exists()) {
                        // The username is already taken; handle this case accordingly
                        alert('Username is already taken. Please choose another.');
                        console.log("Taken");
                    } 
                    else {
                        // Username is available; proceed with registration
                        setPersistence(auth, browserLocalPersistence)
                        .then(() => {
                            // Create user with email and password
                            return createUserWithEmailAndPassword(auth, email_signin, password_signin);
                        })
                        .then((userCredential) => {
                            updateProfile(auth.currentUser, {
                            displayName: username,
                            photoURL: ""
                            }).catch((error) => {
                            alert(error.message);
                            });
                            // Registration successful
                            const user = userCredential.user;
                            this.$emit('user', user);
                            this.setUser(auth.currentUser);
                            this.$router.push('/');

                            // Add the username-userID pair to the database
                            const userId = user.uid;
                            set(ref(db, `/username/${username}`), userId);
                        })
                        .catch((error) => {
                            // Handle registration error
                            console.log(error.code);
                            alert(error.message);
                        });
                    }
                });
            },

            
        },
        data() {
            return {
                form: false,
                username: null,
                email: null,
                password1: null,
                password2: null,
                loading: false,
                show1: false,
                show2: false,
                rules:{
                    required: value => !!value || 'Field is required',
                    min: value => value.length >= 8 || 'Password must be min 8 characters',
                    digit: value => (/\d/.test(value)) || 'Password must include a number',
                    capital: value => (/[A-Z]/.test(value)) || 'Password must include a capital letter',
                    email: value => (/.+@.+\..+/.test(value)) || 'Email must be valid',
                    passwordmatch: value => value==this.password1 || "Password doesn't match",
                },
            }
        },
    };
  </script>

 
<style scoped>

div{
    width: 100%;
    height: 100%;
}

.shake {
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(5px); }
}

#center{
    margin: auto;
}

.sheet{
    max-width: 400px;
    width: 90%;
}


img{
    height: 100%;
    width: 100%;
}


@media (min-width: 769px){
    #register{
        font-size: 3vw;
        padding-top: 3vw;
        padding-bottom: 3vw;
        text-align: center;
        font-family: 'TitleFont', sans-serif;
        text-decoration: underline;
        height: 10vw
    }

    #registerForm{
        width: 90%;
        margin: auto;
        height: auto;
    }

    #form{
        padding: 5vw 0;
        height: auto;
        padding-bottom: 10vw;
        width: 85%;
        margin: auto;
        border-bottom: none;
    }

    #link{
        font-size: 1.4vw;
        text-align: center;
        height: auto;
        font-family: 'TitleFont', sans-serif;
        padding-top: 0;
        margin: auto;
        color: black;
    }
}

@media (max-width: 768px){
    #register{
        font-size: 10vw;
        padding-top: 10vw;
        padding-bottom: 10vw;
        text-align: center;
        font-family: 'TitleFont', sans-serif;
        text-decoration: underline;
        height: auto
    }

    #registerForm{
        width: 90%;
        margin: auto;
        height: auto;
    }

    #form{
        padding: 5vw 0;
        height: auto;
        padding-bottom: 10vw;
        width: 85%;
        margin: auto;
        border-bottom: none;
    }

    #link{
        font-size: 5vw;
        text-align: center;
        height: auto;
        font-family: 'TitleFont', sans-serif;
        padding-top: 0;
        margin: auto;
        color: black;
    }
}
</style>