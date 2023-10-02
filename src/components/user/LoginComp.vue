<template>

    <v-sheet class="sheet" style="max-width: 400px" id="center" rounded >
        <div id="login">Login</div>

        <v-form
            v-model="form"
            @submit.prevent="onSubmit"
            id="loginForm"
        >
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
            v-model="password"
            :readonly="loading"
            :rules="[rules.required]"
            clearable
            label="Password"
            placeholder="Enter your password"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"     
            @click:append-inner="show=!show"
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
            @click="login"
            >
            Sign In
            </v-btn>
        </v-form>
        <br>

        <div id="link">
            <router-link to="/register">Register here</router-link>
        </div>
        <br>

        <div id="social">  
            <!-- Facebook login button -->
            <div class="social-signin_facebook" @click="signInWithFacebook">
                <img src="../../assets/photos/facebook_logo-transparent.png" alt="facebook_logo">
            </div>
                
            <!-- Google login button -->
            <div class="social-signin_google" @click="signInWithGoogle">
                <img src="../../assets/photos/google_logo.png" alt="google_logo">
            </div>
        </div>
        
        <!-- Registration link -->
        
    </v-sheet>
    
  </template>
  
<script>
    import { 
        getAuth, 
        signInWithEmailAndPassword, 
        setPersistence, browserLocalPersistence, 
        GoogleAuthProvider, 
        signInWithPopup, 
        FacebookAuthProvider 
    } from "firebase/auth"
    import { mapActions } from 'vuex';
  
    export default {
        components: {},
  
        methods: {
            ...mapActions(['setUser']),
                
            // Handle user login
            login() {
                if (!this.form) return

                this.loading = true

                setTimeout(() => (this.loading = false), 2000)

                const email_login = this.email;
                const password_login = this.password;

                const auth = getAuth();
        
                // Set persistence to LOCAL to enable persistent authentication
                setPersistence(auth, browserLocalPersistence)
                .then(() => {
                    // Sign in with email and password
                    return signInWithEmailAndPassword(auth, email_login, password_login);
                })
                .then((userCredential) => {
                    // Login successful
                    const user = userCredential.user;
                    this.$emit('user', user);
                    this.setUser(auth.currentUser);
                    this.$router.push('/');
                })
                .catch((error) => {
                    // Handle login error
                    this.WrongInfo = true;
                    console.log(error.code);
                    // alert(error.message);
                });
            },
    
            // Handle Google sign-in
            signInWithGoogle() {
            const provider = new GoogleAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((userCredential) => {
                // Login successful
                const user = userCredential.user;
                this.$emit('user', user);
                this.setUser(user);
                this.$router.push('/');
                })
                .catch((error) => {
                // Handle login error
                console.log(error.code);
                alert(error.message);
                });
            },
    
            // Handle Facebook sign-in
            signInWithFacebook() {
            const provider = new FacebookAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((userCredential) => {
                // Login successful
                const user = userCredential.user;
                this.$emit('user', user);
                this.setUser(user);
                this.$router.push('/');
                })
                .catch((error) => {
                // Handle login error
                console.log(error.code);
                alert(error.message);
                });
            },
        },
        data: () => ({
            form: false,
            email: null,
            password: null,
            loading: false,
            show: false,
            rules:{
                required: value => !!value || 'Field is required',
                min: value => value.length >= 8 || 'Password must be min 8 characters',
                digit: value => (/\d/.test(value)) || 'Password must include a number',
                capital: value => (/[A-Z]/.test(value)) || 'Password must include a capital letter',
                email: value => (/.+@.+\..+/.test(value)) || 'Email must be valid',
                passwordmatch: value => value==this.password1 || "Password doesn't match",
            },
            loginComp: false,
            passwordCheck: false,
            passwordEmpty: true,
            emailNotValidated: false,
            WrongInfo: false
        }),
    }
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
    #login{
        font-size: 3vw;
        padding-top: 3vw;
        padding-bottom: 3vw;
        text-align: center;
        font-family: 'TitleFont', sans-serif;
        text-decoration: underline;
        height: 10vw
    }

    #loginForm{
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

    #social{
        height: auto;
        width: 100%;
        margin: auto;
        border-top: dashed;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .loginWith{
        display: none;
        width: 90%;
        font-size: 5vw;
        text-decoration: underline;
    }

    .social-signin_facebook{
        width: 20%;
        height: auto;
        margin: 2vw;
        padding: 0.3vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 50%;
        border: solid;
        background-color: #2f7af4;
        cursor: pointer;
    }
    .social-signin_google{
        height: auto;
        width: 20%;
        margin: 2vw;
        padding: 1vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 50%;
        border: solid;
        background-color: white;
        cursor: pointer;
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
    #login{
        font-size: 10vw;
        padding-top: 10vw;
        padding-bottom: 10vw;
        text-align: center;
        font-family: 'TitleFont', sans-serif;
        text-decoration: underline;
        height: auto
    }

    #loginForm{
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

    #social{
        height: auto;
        width: 100%;
        margin: auto;
        border-top: dashed;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 5vw;
        padding-bottom: 5vw;
    }
    .loginWith{
        display: none;
        width: 90%;
        font-size: 5vw;
        text-decoration: underline;
    }

    .social-signin_facebook{
        width: 25%;
        height: auto;
        margin: 5vw;
        padding: 0.7vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 50%;
        border: solid;
        background-color: #2f7af4;
        cursor: pointer;
    }
    .social-signin_google{
        height: auto;
        width: 25%;
        margin: 5vw;
        padding: 1vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 50%;
        border: solid;
        background-color: white;
        cursor: pointer;
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