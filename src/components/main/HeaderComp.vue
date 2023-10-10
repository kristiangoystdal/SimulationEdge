<template v-slot:header>
    <header>
        <div class="logo">
            <a href="/" target="_top">
                <img src="../../assets/photos/Logo_siden.png" alt="Logo" target="_top" href='/'>
            </a>
        </div>
        <div v-if="isScreenWideEnough">
            <nav>	
                <ul class="nav-menu">
                    <li v-for="item in menu" :key="item.name">
                        <router-link v-if="!item.hasOwnProperty('userState')" class="menuItem" :to="item.url">{{ item.name }}</router-link>
                        <div v-else>
                            <router-link v-if="!user" class="menuItem" to="/login">Login/Register</router-link>
                            <router-link v-if="user" class="menuItem" to="/account">Account</router-link>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
        <div v-else>
            <div id="menu-button">
                <img src="../../assets/photos/Hamburger_icon.png" alt="Hamburger Icon" @click="toggleMenu">
                <div v-if="menuState" id="menu">
                    <li v-for="item in menu" :key="item.name">
                        <router-link v-if="!item.hasOwnProperty('userState')" class="menuItem" :to="item.url" @click="toggleMenu">{{ item.name }}</router-link>
                        <div v-else>
                            <router-link v-if="!user" class="menuItem" to="/login" @click="toggleMenu">Login/Register</router-link>
                            <router-link v-if="user" class="menuItem" to="/account" @click="toggleMenu">Account</router-link>
                        </div>
                    </li>
                    <v-icon icon="mdi-close" size="15vw" id="menuClose" @click="toggleMenu"></v-icon>
                </div>
            </div>
        </div>
        
    </header>        
</template>

<script>
  import { getAuth, onAuthStateChanged} from "firebase/auth"
  import { mapActions } from 'vuex';

export default {
    name: 'HeaderComponent',
    components: {
        // User
    },
    props:[
        'isLoggedIn'
    ],
    data() {
        return {
            username: "username",
            menu: [
                { name: "Home", url: "/" },
                { name: "Games", url: "/games" },
                // { name: "Formula", url: "/formulacentral" },
                { name: "Videos", url: "/videos" },
                { name: "Login or Account Placeholder", url: "/login", userState: 0},
            ],
            menuState: false,
            mobile: false,
            isScreenWideEnough: false,
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
            } 
            else {
                this.$emit('user', null);
                this.setUser(null);
                }
            });
        },
        checkScreenWidth() {
            this.isScreenWideEnough = window.innerWidth >= 768; // Adjust the threshold as needed
        },
        toggleMenu(){
            this.menuState = !this.menuState
        },
    },
    created() {
        this.observeAuthState();
        // Call the method to check screen width initially
        this.checkScreenWidth();

        // Add a window resize event listener to update the screen width check
        window.addEventListener('resize', this.checkScreenWidth);
    },
    beforeDestroy() {
        // Remove the event listener when the component is destroyed to prevent memory leaks
        window.removeEventListener('resize', this.checkScreenWidth);
    },
    computed: {
        user() {
            return this.$store.getters.getCurrUser;
        },
        
    },
}
</script>

<style scoped>
    @media (min-width: 769px){
        body{
            background: #eee;
            margin: 0;
            padding: 0;
        }
        header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 5vw;
            top: 0;
            padding: 0;
            margin: 0;
        }
        
        .logo{
            height: 100%;
            padding: 1%;
            position: relative;
        }

        img{
            height: 100%;
            width: 100%;
        }

        .logo::before {
            content: ""; /* clear the content */
            display: block; /* make the pseudo-element a block-level element */
            position: absolute; /* position the gradient behind the logo */
            top: 0; /* align the top of the gradient with the top of the logo */
            left: 0; /* align the left of the gradient with the left of the logo */
            width: 100%; /* make the gradient the same width as the logo */
            height: 100%; /* make the gradient the same height as the logo */
            background-image: radial-gradient(ellipse at center,  #ffffff,#ffffff93, #9308ba00, #9308ba00);
            z-index: -1;
        }

        .nav-menu{
            display: flex;
        }

        nav{
            display: block;
            padding-right: 20px;
        }
        nav ul{
            list-style: none;
        }
        nav ul li{
            margin-left: 1.5vw;
            margin-right: 1.5vw;
        }

        .menuItem{
            text-decoration: none;
            color: white;
            display: inline-block;
            text-align: center;
            width: auto;
            font-size: 1.5vw;
            text-align: center;
            font-family: 'TitleFont', sans-serif;
        }
        @font-face {
            font-family: 'TitleFont';
            font-display: auto;
            font-weight: 400;
            font-style: normal;
            src: url('../../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
        }

        .link{
            text-decoration: none;
            color: white;
        }
    }

    @media (max-width: 768px){
        body{
            background: #eee;
            margin: 0;
            padding: 0;
        }
        header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 15vw;
            top: 0;
            padding: 0;
            margin: 0;
        }
        
        .logo{
            height: 50%;
            padding: 1%;
            position: relative;
        }

        img{
            height: 100%;
            width: 100%;
        }

        .logo::before {
            content: ""; /* clear the content */
            display: block; /* make the pseudo-element a block-level element */
            position: absolute; /* position the gradient behind the logo */
            top: 0; /* align the top of the gradient with the top of the logo */
            left: 0; /* align the left of the gradient with the left of the logo */
            width: 100%; /* make the gradient the same width as the logo */
            height: 100%; /* make the gradient the same height as the logo */
            background-image: radial-gradient(ellipse at center,  #ffffff,#ffffff93, #9308ba00, #9308ba00);
            z-index: -1;
        }

        li{
            list-style: none;
        }

        #menu-button{
            width: 8vw;
            height: auto;
            cursor: pointer;
            margin-right: 2vw;
            z-index: 101;
        }

        #menu{
            z-index: 100;
            display: inline-block;
            position: absolute;
            margin: auto;
            padding-top: 50%;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background-color: #ac19e1;
            text-decoration: none;
            list-style: none;
            text-align: center;
            align-items: center;
            justify-content: center;
        }
        .menuItem {
            text-decoration: none;
            color: white;
            display: inline-block;
            text-align: center;
            width: auto;
            font-size: 7vw;
            font-family: 'TitleFont', sans-serif;
            padding: 3vw;
            margin: auto;
            /* border: solid; */
        }

        @font-face {
            font-family: 'TitleFont';
            src: url('../../assets/fonts/FredokaOne-Regular.ttf');
        }

        .link{
            text-decoration: none;
            color: white;
        }

        #menuClose{
            width: 2vw;
            height: auto;  
        }

        .slide-enter-active, .slide-leave-active {
            transition: all 0.5s ease;
        }
        .slide-enter, .slide-leave-to {
            transform: translateX(100%);
        }



    }
</style>
