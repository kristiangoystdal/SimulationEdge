<template>
    <div id="box">
        <!-- Registration form -->
        <div id="register">Register</div>
    
        <div id="form">
            <!-- Email input -->
            <div id="emailBox">
                <input type="text" id="email" name="email" placeholder="E-mail" ref="email_signin" @input="validateEmail">
            </div>
            <!-- Password input -->
            <div id="passwordBox1">
                <input type="text" id="password" name="password" placeholder="Password" ref="password_signin" @input="passwordChecker">
            </div>
            <!-- Repeat Password input -->
            <div id="passwordBox2">
                <input type="text" id="password_check" name="passwordCheck" placeholder="Repeat Password" ref="password_signin" @input="passwordChecker">
            </div>
            <!-- Validation messages -->
            <div id="errorMessages">
                <div v-if="emailNotValidated">E-mail is not a valid e-mail address</div>
                <div v-if="passwordDifferent">Password does not match</div>
            </div>
            <!-- Register button -->
            <input type="submit" id="registerButton" name="register_Submit" value="Sign up" @click="register">
        </div>
  
        <!-- Social login options -->
        <div id="social">
            <h1 class="registerWith">Sign in with:</h1><br>
            <!-- Facebook register -->
            <div class="social-signin_facebook" @click="signInWithFacebook">
                <img src="../assets/photos/facebook_logo-transparent.png" alt="facebook_logo">
            </div>
            <!-- Google register -->
            <div class="social-signin_google" @click="signInWithGoogle">
                <img src="../assets/photos/google_logo.png" alt="google_logo">
            </div>
        </div>
  
        <!-- Link to login page -->
        <div id="registerLink">
            <router-link to="/login">Login here</router-link>
        </div>
    </div>
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
            
            // Validate email format
            validateEmail() {
                const emailInput = document.getElementById("email").value;
                // Regular expression to check if the input is a valid email address
                const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                return emailPattern.test(emailInput);
            },
            
            // Check if passwords match
            passwordChecker() {
                return document.getElementById('password').value === document.getElementById('password_check').value;
            },
            
            // Validate input and trigger registration
            inputValidater() {
                this.passwordDifferent = false;
                this.emailNotValidated = false;

                var faultyRegister = false
        
                if (!this.passwordChecker()) {
                    this.passwordDifferent = true;
                    faultyRegister =  true;
                }
                
                if (!this.validateEmail()) {
                this.emailNotValidated = true;
                    faultyRegister = true;
                }
        
                return !faultyRegister;
            },
            
            // Handle registration
            register() {
                if (this.inputValidater()) {
                    console.log("Check Done");
                    const email_signin = this.$refs.email_signin.value;
                    const password_signin = this.$refs.password_signin.value;
            
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
                } 
                else {
                    console.log("Faulty register info");
            
                    // Shake animation
                    const registerButton = document.getElementById('registerButton'); // Get the button by its id
                    registerButton.classList.add('shake');
            
                    // Remove the shake class after the animation completes
                    setTimeout(() => {
                        registerButton.classList.remove('shake');
                    }, 500); // Adjust the time (in milliseconds) to match your animation duration
                }
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
        data() {
        return {
            passwordCheck: true,
            passwordEmpty: true,
            emailNotValidated: false,
            passwordDifferent: false,
            emptyInputs: false,
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

@media (max-width: 768px){
    #box{
        margin: 3vw auto;
        width: 90vw;
        min-height: auto;
        /* border-color: green; */
        border-radius: 10px;
        border: solid;
        background-color:#ac19e1;
    }

    #register{
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
        /* padding-left: 5vw;    */
        width: 100%;  
        height: auto;
        margin: auto;
        align-items: center;
        display: flex;
        border-radius: 1vw;
    }
    
    #username, #email, #password, #password_check{
        width: 99%;
        height: 10vw;
        margin-bottom: 0.8vw;
        font-size: auto;
        border-radius: 1vw;
        font-family: 'TitleFont', sans-serif;
    }
    
    #registerButton{
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
        /* border: solid; */
        border-top: dashed;
        padding-top: 5vw;
        background-color: #ac19e1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .registerWith{
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



    /* #register-box{
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

    #register-text{
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

    #signup, #register{
        width: 70%;
        height: auto;
        font-size: 4vw;
        margin: 2vw auto;
    }

    .registerWith{
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
    } */

}
/* #register-box{
    margin: 3vw auto;
    width: 30vw;
    border-color: green;
    border-radius: 10px;
    border: solid;
    display: flex;
    background-color:#ac19e1;
}

#register-text{
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

#signup, #register{
    width: 70%;
    height: auto;
    font-size: 1.3vw;
}

.registerWith{
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