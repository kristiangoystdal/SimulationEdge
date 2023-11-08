<template>
    <TitleVue :title='pageTitle'></TitleVue>
</template>

<script>
    import TitleVue from '../extra/Title.vue';

    export default {
        name: 'Basefile',
        data() {
            return {
                pageTitle: "Flappy Bird"
            };
        },
        components: {
            TitleVue
        },
    }
</script>

<style scoped>
    @media (min-width: 769px) {

    }

    @media (max-width: 768px) {

    }
</style>
