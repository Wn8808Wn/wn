<template>
  <div class="head-top">
    <div class="top-left">
      <div class="logo"></div>
    </div>
    <div class="top-middle">
      <div class="search-box">
        <input type="text"
               placeholder="搜索..." />
        <div class="search-ico"></div>
      </div>
    </div>
    <div class="top-right">
      <ul>
        <li>
          <a @click="handleNotifyClick">
            <img src="../../assets/images/notify.png" />
            <span class="notify"></span>
          </a>
          <span></span>
        </li>
        <li>
          <a class="photo-a"
             @click="handlePhotoClick">
            <img src="../../assets/images/photo.png" />
          </a>
        </li>
        <li>
          <el-dropdown placement="top"
                       @command="handleCommand"
                       trigger="click">
            <span class="el-dropdown-link">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">个人资料</el-dropdown-item>
              <el-dropdown-item command="b">修改密码</el-dropdown-item>
              <el-dropdown-item command="c">下载客户端</el-dropdown-item>
              <el-dropdown-item command="d">版本v2.6</el-dropdown-item>
              <el-dropdown-item command="e">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <!-- 个人资料 -->
    <personal-data @userchangedialog="handleIndexChange"
                   :userData="userData"
                   v-if="userData.length != 0"
                   :userDialogIndex="userDialogIndex"></personal-data>
    <!-- 修改密码 -->
    <pass-word @userchangedialog="handleIndexChange"
               :wordDialogIndex="wordDialogIndex"></pass-word>
  </div>
</template>

<script>
export default {
  data () {
    return {
      wordDialogIndex: -1,
      userDialogIndex: -1,
      userData: [],
      username: ''
    }
  },
  components: {
    PersonalData: () => import('./components/PersonalData.vue'),
    PassWord: () => import('./components/PassWord.vue')
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
    },
    handlePhotoClick () { // 点击头像
      this.userDialogIndex = 1
    },
    handleNotifyClick () {
      alert('通知')
    },
    handleCommand (command) {
      if (command === 'a') { // 个人资料
        this.userDialogIndex = 1
      }
      if (command === 'b') { // 修改密码
        this.wordDialogIndex = 1
      }
      if (command === 'c') { // 下载客户端
        console.log(command)
      }
      if (command === 'd') { // 版本号
        console.log(command)
      }
      if (command === 'e') { // 退出
        sessionStorage.removeItem('dsToken')
        sessionStorage.removeItem('lifeTime')
        this.$router.push('/')
        this.$message({
          showClose: true,
          type: 'success',
          message: '退出成功',
          duration: 1000
        })
      }
    },
    handleIndexChange (num) {
      this.userDialogIndex = this.wordDialogIndex = num
    },
    getUserInfo () {
      let params = {
        url: 'http://192.168.1.34:1945/v3/User/getUserInfo',
        method: 'post',
        data: {},
        callback: res => {
          if (res.status === 200 && res.ret === 0) {
            this.userData = res.data
            this.username = res.data[0].clientname
          }
        },
        errcallback: msg => {
          console.log(msg)
        }
      }
      this.$http.sendRequest(params)
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/mixins';
.head-top {
  height: 50px;
  min-width: 1050px;
  background-image: linear-gradient(-90deg, #609ee9 0%, #5594df 100%);
  .top-left {
    float: left;
    .wh(202px, 50px);
    .logo {
      .wh(202px, 50px);
      background: url('~images/logo_bj.png') no-repeat center;
    }
  }
  .top-middle {
    float: left;
    .search-box {
      position: relative;
      margin: 10px 0 10px 20px;
      .wh(180px, 30px);
      input {
        .wh(132px, 20px);
        border: 0;
        padding: 5px 32px 5px 16px;
        border-radius: 24px;
        font-size: 14px;
      }
      .search-ico {
        position: absolute;
        top: 5px;
        right: 8px;
        .wh(20px, 20px);
        background: url('~images/search.png') no-repeat center;
        cursor: pointer;
      }
    }
  }
  .top-right {
    float: right;
    .wh(242px, 50px);
    ul {
      float: left;
      margin-top: 8px;
      li {
        height: 36px;
        float: left;
        line-height: 36px;
      }
      li:nth-child(1) {
        width: 42px;
      }
      li:nth-child(1) a {
        float: left;
        display: block;
        .wh(28px, 29px);
        position: relative;
      }
      li:nth-child(1) .notify {
        display: block;
        position: absolute;
        top: 0;
        right: 6px;
        border-radius: 50%;
        .wh(5px, 5px);
        background: #ff0000;
      }
      li:nth-child(1) span {
        float: right;
        display: block;
        width: 1px;
        height: 20px;
        margin-top: 8px;
        border-right: 1px solid #68a7f2;
      }
      li:nth-child(1) img {
        .wh(28px, 29px);
        text-align: center;
        cursor: pointer;
      }
      li:nth-child(2) {
        padding-left: 20px;
        padding-right: 9px;
      }
      li:nth-child(2) .photo-a {
        display: block;
        .wh(36px, 36px);
      }
      li:nth-child(2) img {
        .wh(36px, 36px);
        border-radius: 18px;
        background: #fff;
        // background: url('~images/photo.png') no-repeat center;
        cursor: pointer;
      }
      li:nth-child(3) {
        padding-right: 30px;
      }
      li:nth-child(3) .el-dropdown {
        float: left;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="less">
// 下拉菜单
.el-popper {
  margin-top: 8px !important;
  .el-dropdown-menu__item {
    box-sizing: border-box;
    padding: 0 10px;
    line-height: 34px;
    text-align: center;
  }
}
.el-dropdown-menu {
  padding: 0;
}
// 对话框
.el-dialog {
  border-radius: 12px;
  .el-form {
    padding: 0 14px;
    font-size: 14px;
    .el-form-item {
      height: 34px;
      line-height: 34px;
      margin-bottom: 20px;
      .el-form-item__label {
        height: 34px;
        padding: 0;
      }
      .el-form-item__content {
        padding: 0;
        height: 34px;
        line-height: 34px;
        .el-input {
          height: 34px;
          .el-input__inner {
            height: 34px;
          }
        }
      }
    }
    .photo {
      // 图片样式
      height: 48px;
      overflow: hidden;
      .el-form-item__content {
        height: 48px;
        .touxiang {
          width: 48px;
          height: 48px;
          img {
            width: 48px;
            height: 48px;
          }
        }
        .upload-box {
          height: 48px;
          width: 244px;
          padding-left: 10px;
          .el-upload {
            display: block;
            width: 80px;
            line-height: 24px;
            height: 24px;
          }
          .el-upload__tip {
            height: 24px;
            font-size: 12px;
            color: #666;
            line-height: 24px;
            margin: 0;
          }
          .el-button {
            height: 24px;
            width: 70px;
            font-size: 12px;
            padding: 0;
            line-height: 22px;
          }
        }
      }
    }
    .textarea-box {
      // 多行文本域样式
      height: 54px;
    }
  }
  .dialog-bottom {
    text-align: right;
    .el-button {
      width: 80px;
    }
  }
}

.distpicker-address-wrapper {
  // 三级联动样式
  height: 34px;
  select {
    float: left;
    text-align: center;
    border-radius: 4px;
    width: 84px;
    margin-right: 14px;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    padding: 0 0 0 7px;
  }
  select:last-child {
    margin: 0;
  }
}
.date-picker {
  // 修改日期插件样式
  .el-input__prefix {
    i {
      line-height: 38px;
      font-size: 15px !important;
    }
  }
}
</style>
