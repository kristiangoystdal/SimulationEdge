<template>
    <div id="parent">
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
    </div>
</template>

<script>
export default {
   
}
</script>

<style scoped>
    #parent {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(7, 1fr);       
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        margin: auto;
        align-items: center;
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
