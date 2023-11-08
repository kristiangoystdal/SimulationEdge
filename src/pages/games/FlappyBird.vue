<template>
    <FlappyBird></FlappyBird>
    <!-- <HighscoreComp></HighscoreComp> -->
</template>
    
<script>
    import FlappyBird from '../../components/games/FlappyBird.vue'
    // import HighscoreComp from '../../components/HighscoreComp.vue'

    export default{
        name: "FlappyBirdPage", 
        components: {
            FlappyBird, 
            // HighscoreComp,
        }
    }
</script>
    
<style scoped>

</style>
    