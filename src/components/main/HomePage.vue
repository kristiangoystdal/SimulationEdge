<template>
  <div class="startPic">
    <img src="../../assets/photos/SimpleBackground1.png" alt="Background">
  </div>
</template>

<script>
export default {

};
</script>

<style scoped>
.startPic {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  left: 0;
  height: 100vh;
  max-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
