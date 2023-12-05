<template>
    <FlappyBook></FlappyBook>
    <!-- <HighscoreComp></HighscoreComp> -->
</template>
    
<script>
    import FlappyBook from '../../components/games/FlappyBook.vue'
    // import HighscoreComp from '../../components/HighscoreComp.vue'

    export default{
        name: "FlappyBirdPage", 
        components: {
            FlappyBook, 
            // HighscoreComp,
        }
    }
</script>
    
<style scoped>

</style>
    