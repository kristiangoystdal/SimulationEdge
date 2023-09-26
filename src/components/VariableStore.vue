<template>
    <div id="varStorage">
      <h2>Variable Store</h2>
      <div id="variableGrid">
        <li v-for="item in variables" :key="item.name">
          <div id="varItem">{{item.name}} = {{ item.value }}</div>
        </li>
      </div>
    </div>
    
</template>

<script>
export default {
  data() {
    return {
        variables: [
          { name: "k", value: "1.38×10−23" },
          { name: "e", value: "2.71828" },
          { name: "k", value: "/" },
          { name: "k", value: "/" },
          { name: "k", value: "/" },
          { name: "k", value: "/" },
          { name: "k", value: "/" },
          { name: "k", value: "/" },
          { name: "k", value: "/" },
          { name: "k", value: "/" },
          { name: "k", value: "3" },
        ],
    }
  },
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

    li{
      list-style-type: none;
    }

    #varStorage{
      width: 80%;
      height: auto;
      margin: auto;
      display: inline-block;
      border: solid;
      border-radius: 4vw;
    }

    #varStorage h2{
      padding: 2vw;
      /* border: solid; */
      text-align: center;
    }

    #variableGrid{
      display: grid;
      grid-template-columns: 1fr 1fr;
      text-align: center;
    }

    #varItem{
      text-decoration: none;
      font-size: 5vw;
      padding: 1vw;
    }
  }
</style>
