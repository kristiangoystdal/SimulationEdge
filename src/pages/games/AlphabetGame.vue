<template>
    <AlphabetGameComp></AlphabetGameComp>
    <!-- <HighscoreComp></HighscoreComp> -->
    <!-- <DevelopmentComp></DevelopmentComp> -->
</template>
    
<script>
    // import DevelopmentComp from '../../components/DevelopmentComp.vue'
    import AlphabetGameComp from '../../components/games/AlphabetGame.vue'
    // import HighscoreComp from '../../components/HighscoreComp.vue'

    export default{
        name: "AlphabetGamePage", 
        components: {
            // DevelopmentComp, 
            AlphabetGameComp, 
            // HighscoreComp,
        }
    }
</script>
    
<style scoped>

</style>
    