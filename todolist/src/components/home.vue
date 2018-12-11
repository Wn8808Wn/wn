<template>
<div class="home">
    <top-com></top-com>
    <div class="left">
      <side-com></side-com>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
</div>


</template>


<script>
import topCom from "./top"
import sideCom from "./sidebar"
// import conCom from "./content"
export default {
  name: 'home',
  components:{
    topCom,
    sideCom,
    // conCom
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.home{
  width: 100%;
  height: 100%;
  background: steelblue;
  .left{
    width: 30%;
    position: absolute;
    left: 0;
    top: 80px;
    background: fuchsia;
  }
  .right{
    width: 70%;
    position: absolute;
    left: 30%;
    top: 80px;
    background: seagreen;
  }
}


</style>
