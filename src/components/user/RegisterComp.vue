<template>

    <v-sheet w-90 style="max-width: 400px" id="center" rounded >
        <div id="register">Register</div>

        <v-form
            v-model="form"
            @submit.prevent="onSubmit"
            id="registerForm"
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

        <br><br>
        
        <!-- Registration link -->
        <div>
            <router-link to="/login">Login here</router-link>
        </div>
    </v-sheet>
    
</template>
  
<script>
    import {
        getAuth,
        createUserWithEmailAndPassword,
        setPersistence,
        browserLocalPersistence,
        GoogleAuthProvider,
        signInWithPopup,
        FacebookAuthProvider,
    } from "firebase/auth";
    import { mapActions } from 'vuex';
    
    export default {
        components: {
            // Password,
        },
        methods: {
            ...mapActions(['setUser']),
            
            // Handle registration
            register() {
                if(!this.form) return

                this.loading = true

                setTimeout(() => (this.loading = false), 2000)

                const email_signin = this.email;
                const password_signin = this.password1;
        
                const auth = getAuth();
                // Set persistence to LOCAL to enable persistent authentication
                setPersistence(auth, browserLocalPersistence)
                .then(() => {
                    // Create user with email and password
                    return createUserWithEmailAndPassword(auth, email_signin, password_signin);
                })
                .then((userCredential) => {
                    // Registration successful
                    const user = userCredential.user;
                    this.$emit('user', user);
                    this.setUser(auth.currentUser);
                    this.$router.push('/');
                })
                .catch((error) => {
                    // Handle registration error
                    console.log(error.code);
                    alert(error.message);
                });   
            },
            
        },
        data() {
            return {
                form: false,
                email: null,
                password1: null,
                password2: null,
                loading: true,
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

@media (min-width: 769px){
    #box{
        margin: 3vw auto;
        width: 90vw;
        height: 80vh;
        /* border-color: green; */
        border-radius: 10px;
        border: solid;
        background-color:#ac19e1;
    }

    #register{
        font-size: 3vw;
        padding-top: 3vw;
        padding-bottom: 3vw;
        text-align: center;
        font-family: 'TitleFont', sans-serif;
        text-decoration: underline;
        height: auto;
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

    #social{
        height: auto;
        width: 100%;
        margin: auto;
        /* border: solid; */
        border-top: dashed;
        /* background-color: #ac19e1; */
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


    .social-text{
        width: 70%;
        font-size: 3.4vw;
    }

    img{
        height: 100%;
        width: 100%;
    } 

    #registerLink{
        font-size: 6vw;
        text-align: center;
        width: 50%;
        height: auto;
        font-family: 'TitleFont', sans-serif;
        padding-top: 0;
        padding-bottom: 10vw;
        margin: 5vw auto;
        /* border: solid; */
        align-items: center;
        color: black;
        text-decoration: underline;
    }

    #errorMessages{
        background-color: #ff0000;
        color: black;
        font-size: 4vw;
        text-align: center;
        width: auto;
        height: auto;
        border-radius: 1vw;
        font-family: 'TitleFont', sans-serif;
    }

}

/* @media (max-width: 768px){
    #box{
        margin: 3vw auto;
        width: 90vw;
        height: 80vh;

        border-radius: 10px;
        border: solid;
        background-color:#ac19e1;
    }

    #login{
        font-size: 10vw;
        padding-top: 15vw;
        padding-bottom: 15vw;
        text-align: center;
        font-family: 'TitleFont', sans-serif;
        text-decoration: underline;
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
    #emailBox, #passwordBox1, #passwordBox2{
        
        width: 100%;  
        height: auto;
        margin: auto;
        border-radius: 1vw;
        display: flex;
    }
    
    #username, #email, #password{
        width: 100%;
        height: 10vw;
        margin: 0.5vw auto;
        font-size: auto;
        border-radius: 1vw;
        font-family: 'TitleFont', sans-serif;
    }
    
    #loginButton{
        width: 50%;
        height: auto;
        font-size: 5vw;
        margin: 5vw 25%;
        font-family: 'TitleFont', sans-serif;
    }

    #social{
        height: auto;
        width: 100%;
        margin: auto;
        border-top: dashed;
        padding-top: 5vw;
        background-color: #ac19e1;
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
        height: 15vw;
        width: auto;
        margin: 2vw;
        padding: 2vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 50%;
        border: solid;
        background-color: #2f7af4;
        cursor: pointer;
    }
    .social-signin_google{
        height: 15vw;
        width: auto;
        margin: 2vw;
        padding: 2vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 50%;
        border: solid;
        background-color: white;
        cursor: pointer;
    }


    .social-text{
        width: 70%;
        font-size: 3.4vw;
    }

    img{
        height: 100%;
        width: 100%;
    } 

    #registerLink{
        font-size: 6vw;
        text-align: center;
        width: 50%;
        height: auto;
        font-family: 'TitleFont', sans-serif;
        padding-top: 0;
        padding-bottom: 10vw;
        margin: 5vw auto;
        align-items: center;
        color: black;
        text-decoration: underline;
    }

    #errorMessages{
        background-color: #ff0000;
        color: black;
        font-size: 4vw;
        text-align: center;
        width: auto;
        height: auto;
        border-radius: 1vw;
        font-family: 'TitleFont', sans-serif;
    }



    /* #login-box{
        margin: 3vw auto;
        width: 90vw;
        height: 100vw;
        border-color: green;
        border-radius: 10px;
        border: solid;
        display: flex;
        align-items: center;
        background-color:#ac19e1;
    }

    #login-text{
        text-decoration: underline;
        font-size: 5vw;
        margin-top: 7vw;
    }

    #left, #right{
        width: 50%;
        height: 100%;
        text-align: center;
        margin: 2vw auto;  
    }
    #left{
        border-right: solid;
        border-style: dashed;
    }

    #username, #email, #password{
        width: 80%;
        height: 5vw;
        margin: 0.5vw;
    }

    #signup, #login{
        width: 70%;
        height: auto;
        font-size: 4vw;
        margin: 2vw auto;
    }

    .loginWith{
        width: 90%;
        font-size: 5vw;
        text-decoration: underline;
    }

    .social-signin_facebook{
        height: 10vw;
        width: 90%;
        margin: 1vw auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 2vw;
        border: solid;
        background-color: #2f7af4;
        cursor: pointer;
    }
    .social-signin_google{
        height: 10vw;
        width: 90%;
        margin: 1vw auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 2vw;
        border: solid;
        background-color: white;
        cursor: pointer;
    }

    .social-text{
        width: 70%;
        font-size: 3.4vw;
    }

    img{
        height: 50%;
        width: auto;
        margin: 4vw;
    }

}
/* #login-box{
    margin: 3vw auto;
    width: 30vw;
    border-color: green;
    border-radius: 10px;
    border: solid;
    display: flex;
    background-color:#ac19e1;
}

#login-text{
    text-decoration: underline;
    font-size: 2vw;
}

#left, #right{
    width: 50%;
    text-align: center;
    margin: 5px;  
}
#left{
    border-right: solid;
    border-style: dashed;
}

#username, #email, #password{
    width: 80%;
    height: 2vw;
    margin: 0.5vw;
}

#signup, #login{
    width: 70%;
    height: auto;
    font-size: 1.3vw;
}

.loginWith{
    width: 90%;
    font-size: 1.4vw;
    text-decoration: underline;
}

.social-signin_facebook{
    height: 3vw;
    margin-top: 1vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    border: solid;
    background-color: #2f7af4;
}
.social-signin_google{
    height: 3vw;
    margin-top: 1vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    border: solid;
    background-color: white;
}

.social-text{
    width: 70%;
    font-size: 1.1vw;
}

img{
    height: 50%;
    width: auto;
    margin: 1vw;
} */



</style>