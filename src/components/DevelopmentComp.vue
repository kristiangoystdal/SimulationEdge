<template>
    <div id="box">
        <div id="text">This page is under development</div>
        <div id="image">
            <img src="../assets/photos/development_gif.gif" alt="Coding Gif">
        </div>
    </div>
</template>

<script>
export default {
    name: 'DevelopmentComp'
}
</script>

<style scoped>
  #box {
    margin: auto;
    height: 75vh;
    justify-content: center;
  }

  #text {
    text-align: center;
    font-size: 2.5vw;
    font-family: 'TitleFont', sans-serif;
  }

    @font-face {
        font-family: 'TitleFont';
        src: local('../assets/fonts/FredokaOne-Regular.ttf') format('truetype');
    }

  #image {
    width: auto;
    height: 90%;
    margin: auto;
    padding-top: 0.5vw;
    display: flex;
    justify-content: center;
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }

  @media (max-width: 768px) {
    #box {
        padding-top: 0;
        height: auto;
    }

    #text {
        font-size: 5vw;
        padding-top: 10vw;
    }

    #image {
        width: 90%;
        height: auto;
        padding-top: 5px;
        margin: auto;
        display: flex;
        justify-content: center;
    }
    img {
        width: 100%;
        height: auto;
    }
  }
</style>
