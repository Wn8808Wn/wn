<template>
  <div class="fillcontain">
    <!-- 头部 -->
    <head-top></head-top>
    <div class="left-box">
      <el-menu :default-active="defaultActive"
               background-color="#F5F5F5"
               text-color="#666"
               active-text-color="#fff"
               router
               style="border-right: none">
        <el-menu-item index="/privatedoc"
                      @click="docRefresh">
          <template slot="title">
            <i class="el-icon-menu"></i>
            个人文件
          </template>
        </el-menu-item>
        <el-menu-item index="/teamwork">
          <i class="el-icon-menu"></i>
          团队协作
        </el-menu-item>
        <el-menu-item index="/publicres">
          <i class="el-icon-menu"></i>
          公共资源
        </el-menu-item>
        <el-menu-item index="/myshare">
          <i class="el-icon-setting"></i>
          我的分享
        </el-menu-item>
        <el-menu-item index="/mycollection">
          <i class="el-icon-setting"></i>
          我的收藏
        </el-menu-item>
        <el-menu-item index="/dustbin">
          <i class="el-icon-setting"></i>
          回收站
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeadTop from './header/HeadTop'
export default {
  name: 'manage',
  data () {
    return {
    }
  },
  components: {
    HeadTop
  },
  computed: {
    defaultActive () {
      return this.$route.path
    }
  },
  methods: {
    docRefresh () {
      this.$router.push({
        path: '/allback',
        name: 'allback'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/mixins';
.left-box {
  position: absolute;
  top: 50px;
  left: 0;
  bottom: 0;
  width: 201px;
  background: #f5f5f5;
  border-right: 1px solid #e3e3e3;
  .el-menu {
    .el-menu-item {
      font-family: PingFangSC-Medium;
      height: 44px;
      line-height: 44px;
      i {
        font-size: 14px;
        letter-spacing: 0.22px;
        text-align: center;
      }
    }
    .el-menu-item.is-active {
      background-color: #7bb3f7 !important;
    }
  }
}
.right-box {
  position: absolute;
  top: 50px;
  right: 0;
  bottom: 0;
  left: 202px;
}
</style>
<style lang="less">
.popper__arrow {
  display: none !important;
}
</style>
