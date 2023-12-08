<template>
    <TitleVue :title='pageTitle'></TitleVue>
    <Countdown :countdownDate="date"></Countdown>
</template>

<script>
    import TitleVue from '../extra/Title.vue';
    import Countdown from '../extra/Countdown.vue';

    export default {
        name: 'Basefile',
        data() {
            return {
                pageTitle: "Flappy Book",
                date: "2023-12-24T12:00:00"
            };
        },
        components: {
            TitleVue,
            Countdown,
        },
    }
</script>

<style scoped>
    @media (min-width: 769px) {

    }

    @media (max-width: 768px) {

    }
</style>
