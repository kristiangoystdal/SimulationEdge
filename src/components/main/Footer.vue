<template>
    <footer>
            <div class="foottext">
                <h4 f>© Simulation Edge 2023</h4>

                <img src="../assets/photos/Google-Play-Logo.png" class="google-logo" alt="Google-Play-Logo" href="https://play.google.com/store/apps/developer?id=Simulation+Edge" target="blank">
            </div>
        </footer>
</template>

<script>
export default {
    name: 'FooterComponent'
}
</script>

<style scoped>
    @media (min-width: 769px){
        footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 5vw;
            background-color: #494949a9;
            color: #fff;
            text-align: center;  
        }

        .foottext{
            margin: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: auto;
            height: 100%;
            padding-left: 5%;
            padding-right: 5%;
            font-size: 1.5vw;
        }
        img{
            width: auto;
            height: 100%;
        }
    }



    @media (max-width: 768px){
        footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 15vw;
            background-color: #494949a9;
            color: #fff;
            text-align: center;  
            margin-top: 5vw;
        }

        .foottext{
            margin: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: auto;
            height: 100%;
            padding-left: 5%;
            padding-right: 5%;
            font-size: 3vw;
        }
        img{
            width: auto;
            height: 100%;
        }
    }
</style>
