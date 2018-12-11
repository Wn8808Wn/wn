<template>
  <div class="  ">
    <div class="top">
      <div class="btn-box">

      
        <com-top></com-top>
      </div>
    </div>
    <div class="main">
      <div class="left">
        <doc-left @getParams="getParams"></doc-left>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import ComTop from '../common/ComTop'
import DocLeft from './components/DocLeft'
export default {
  name: 'privatedoc',
  data () {
    return {
      data: [],
      params: ''
    }
  },
  components: {
    ComTop,
    DocLeft
  },
  methods: {
    getParams (data) {
      console.log(data)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~styles/mixins';
.top {
  height: 71px;
  border-bottom: 1px solid #e3e3e3;
  min-width: 1024px;
  .btn-box {
    display: flex;
    padding: 20px 0 20px 21px;
  }
}
.main {
  display: flex;
  position: absolute;
  top: 72px;
  right: 0;
  bottom: 0;
  left: 0;
  min-width: 1024px;
  .left {
    width: 220px;
    height: 100%;
    border-right: 1px solid #ccc;
  }
  .right {
    flex: 1;
  }
}
</style>
