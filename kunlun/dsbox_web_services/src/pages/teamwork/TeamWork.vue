<template>
  <div class="fillcontain">
    <div class="top">
      <div class="btn-box">
        <!-- 创建加入群按钮 -->
        <div class="group icon">
          <i></i>
          <el-dropdown trigger="click">
            <span>创建/加入群<u class="el-icon-arrow-down el-icon--right"></u></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="newGroup">创建群</el-dropdown-item>
              <el-dropdown-item>加入群</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <com-top></com-top>
      </div>
    </div>
    <div class="main">
      <div class="left">
        <team-left></team-left>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
    <!-- 创建群弹层 -->
    <div>
      <el-dialog title="创建群"
                 :visible.sync="dialogVisible"
                 class="group-wrapper"
                 width="460px">
        <el-form ref="group"
                 :rules="rules"
                 :model="group"
                 label-width="83px"
                 class="group-form">
          <el-form-item label="群名称："
                        prop="name">
            <el-input placeholder="请输入群名称"
                      v-model="group.name"
                      @keyup.native="getInputValue"></el-input>
          </el-form-item>
          <el-form-item label="群图标：">
            <div class="icon-wrapper">
              <div class="icon-tx">
                <img v-if="imageUrl"
                     :src="imageUrl">
              </div>
              <!-- 上传图片组件 -->
              <el-upload action="123"
                         :show-file-list="false"
                         :before-upload="beforeAvatarUpload"
                         v-model="group.file"
                         class="icon-upload">
                <el-button size="small">上传图片</el-button>
                <div slot="tip"
                     class="el-upload__tip">支持jpg、jpeg、png格式的图片，文件小于2M</div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="群描述："
                        prop="desc">
            <el-input type="textarea"
                      resize="none"
                      placeholder="描述不可超过50个字"
                      v-model="group.desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button class="sure-btn"
                     v-if="isOk"
                     @click="submitForm('group')">确定</el-button>
          <el-button v-else
                     class="sure-btn-no">确定</el-button>
          <el-button class="cancel-btn">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ComTop from '../common/ComTop'
import TeamLeft from './components/TeamLeft'
export default {
  name: 'teamwork',
  data () {
    var validateName = (rule, value, callback) => {
      // 只能是数字、字母、汉子、下划线
      let regEn = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
      if (value === '') {
        callback(new Error('请输入群名称'))
      } else if (value.length > 20 || !regEn.test(value)) {
        callback(new Error('请输入1-20个字符的汉字、字母、数字、下划线'))
      } else {
        callback()
      }
    }
    var validateDesc = (rule, value, callback) => {
      if (value !== '') {
        if (value.length <= 50) {
          callback()
        } else {
          callback(new Error('描述不可超过50个字'))
        }
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false, // 创建群弹窗
      isOk: false,
      group: { name: '', file: '', desc: '' },
      imageUrl: require('../../assets/images/group_tx.png'),
      rules: { name: [{ validator: validateName, trigger: 'blur' }], desc: [{ validator: validateDesc, trigger: 'blur' }] }
    }
  },
  components: {
    ComTop,
    TeamLeft
  },
  methods: {
    newGroup () { // 创建群弹窗
      if (this.$refs['group'] !== undefined) { this.$refs['group'].resetFields() }
      this.group.name = ''
      this.group.file = ''
      this.group.desc = ''
      this.isOk = false
      this.imageUrl = require('../../assets/images/group_tx.png')
      this.dialogVisible = true
    },
    getInputValue () {
      this.group.name.length > 0 ? this.isOk = true : this.isOk = false
    },
    submitForm (formName) { // 表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) { // 通过后
          this.dialogVisible = false
          this.submitGroup()
        } else { // 没通过
          console.log('error submit!!')
          return false
        }
      })
    },
    submitGroup () { // 创建群接口
      let params = {
        url: 'http://192.168.1.34:1945/v3/Group/addGroup',
        data: {
          'gid': '',
          'gname': this.group.name,
          'gurl': this.group.file,
          'gdesc': this.group.desc
        },
        method: 'post',
        callback: res => {
          if (res.status === 200 && res.ret === 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '群创建成功，邀请小伙伴们加入吧',
              duration: 800
            })
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: res.message,
              duration: 1000
            })
          }
        },
        errcallback: msg => {
          console.log(msg)
        }
      }
      this.$http.sendRequest(params)
    },
    // 上传图片之前的函数
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpg、jpeg、png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if (isJPG && isLt2M) {
        let fd = new FormData()
        fd.append('file', file)
        const headers = {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json'
        }
        headers.Authorization = 'Bearer ' + sessionStorage.dsToken
        axios({
          method: 'post',
          url: 'http://192.168.1.34:1945/v3/comm/uploadimg',
          data: fd,
          headers: headers
        }).then(function (res) {
          this.group.file = res.data.data
          this.imageUrl = 'http://192.168.1.35:4869/' + this.group.file
        }.bind(this)).catch(function (err) {
          console.log(err)
        })
        return true
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/mixins';
.top {
  height: 71px;
  border-bottom: 1px solid #e3e3e3;
  min-width: 1024px;
  .btn-box {
    display: flex;
    padding: 20px 0 20px 21px;
    .icon {
      float: left;
      margin-right: 18px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-family: PingFangSC-Regular;
      border: 1px solid #d4d5db;
      box-shadow: 0 1px 0 0 rgba(233, 233, 233, 0.41);
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      letter-spacing: 0.19px;
      .sc(14px, #5c9ae5);
      i {
        float: left;
        display: block;
        .wh(20px, 20px);
        margin-right: 8px;
      }
      span {
        display: block;
        float: left;
      }
      .el-dropdown {
        font-size: 14px !important;
        .sc(14px, #5c9ae5);
      }
    }
    .group {
      padding: 5px 5px;
      background: #609ee9;
    }
    .group span {
      .sc(14px, #fff);
    }
    .group i {
      background: url('~images/team_w.png') no-repeat center;
    }
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
    .wh(220px, 100%);
    border-right: 1px solid #ccc;
  }
  .right {
    flex: 1;
  }
}
.group-form {
  width: 392px;
  .icon-wrapper {
    overflow: hidden;
    height: 48px;
    .icon-tx {
      float: left;
      img {
        .wh(48px, 48px);
      }
    }
    .icon-upload {
      float: right;
      margin-top: -5px;
      .el-upload__tip {
        margin-top: -8px;
      }
      .el-button {
        .wh(70px, 24px);
        border: 1px solid #609ee9;
        border-radius: 2px;
        padding: 0;
        color: #609ee9;
      }
    }
  }
}
</style>
<style lang="less">
.group-wrapper {
  .el-dialog {
    .el-dialog__header {
      text-align: center;
      .el-dialog__headerbtn {
        right: 30px;
      }
    }
    .el-dialog__body {
      padding-bottom: 0;
    }
    .el-dialog__footer {
      padding: 10px 5px 40px;
      .el-button {
        width: 80px;
        height: 32px;
        padding: 0;
        margin: 0 25px 0 0;
        border-radius: 2px;
      }
      .sure-btn {
        background: rgba(96, 158, 233, 1);
        border: none;
        color: #ffffff;
      }
      .sure-btn-no {
        background: rgba(96, 158, 233, 0.4);
        border: none;
        color: #ffffff;
      }
      .cancel-btn {
        border: 1px solid #609ee9;
        color: #609ee9;
      }
    }
    .group-form {
      .el-form-item {
        height: auto;
      }
      .el-form-item__label {
        padding-right: 10px;
      }
      .el-form-item__content {
        width: 300px;
        height: auto;
        .el-textarea__inner {
          height: 59px;
        }
      }
    }
  }
}
</style>
