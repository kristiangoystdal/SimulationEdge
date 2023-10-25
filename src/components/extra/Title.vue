<template>
    <div>
        <h1>{{ title }}</h1>
    </div>
</template>

<script>
export default {
    name: 'Title',
    props: {
        title: String
    },

}
</script>

<style scoped>

    @font-face {
        font-family: 'TitleFont';
        font-display: auto;
        font-weight: 400;
        font-style: normal;
        src: url('../../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
    }

    @media (min-width: 769px) {
        h1{
            text-decoration: underline;
            text-align: center;
            font-size: 3vw;
            font-family: 'TitleFont', sans-serif;
            padding-bottom: 3vw;
            padding-top: 3vw;
        }
    }

    @media (max-width: 768px) {

    }
</style>
