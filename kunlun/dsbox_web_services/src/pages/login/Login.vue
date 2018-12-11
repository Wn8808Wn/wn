<template>
  <div class="allcover login-wrapper">
    <div class="ctt login-box">
      <h3 class="lr login-title">数据共享管理平台</h3>
      <el-form class="lr login-input"
               :model="form"
               :rules="rules"
               ref="form">
        <el-form-item prop="username">
          <el-input type="username"
                    v-model="form.username">
          </el-input>
          <div class="input-bg tb user-bg"></div>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    v-model="form.password"></el-input>
          <div class="input-bg tb word-bg"></div>
        </el-form-item>
        <el-form-item prop="region">
          <el-select v-model="form.region"
                     placeholder="请选择域">
            <el-option v-for="item of form.fieldList"
                       :key="item.domainid"
                       :label="item.domainname"
                       :value="item.domainid"></el-option>
          </el-select>
          <div class="input-bg tb field-bg"></div>
        </el-form-item>
        <div class="remember">
          <label class="check-box"><input type="checkbox"
                   v-model="remember" />&nbsp;&nbsp;记住密码</label>
        </div>
        <el-button class="submit"
                   :class="{active: chatContent === true}"
                   @click.native.prevent="submit('form')">登 录</el-button>
      </el-form>
      <p class="lr title-bottom">北京信者科技有限公司</p>
    </div>
  </div>
</template>
f
<script>
import md5 from 'md5'
import Cookies from 'js-cookie'
export default {
  name: 'login',
  data () {
    let validateUserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    let validatePassWord = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    let validateRegion = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择域'))
      } else {
        callback()
      }
    }
    return {
      remember: false,
      form: {
        fieldList: [],
        username: '',
        password: '',
        region: ''
      },
      rules: {
        username: [{ validator: validateUserName, trigger: 'blur' }],
        password: [{ validator: validatePassWord, trigger: 'blur' }],
        region: [{ validator: validateRegion, trigger: 'change' }]
      }
    }
  },
  computed: {
    chatContent () {
      return this.username !== '' && this.password !== ''
    }
  },
  methods: {
    getFieldList () { // 获取域列表
      let params = {
        url: 'http://192.168.1.34:1945/v3/Region/getRegions/100/1',
        data: {},
        method: 'post',
        callback: res => {
          if (res.status === 200 && res.ret === 0) {
            this.form.fieldList = res.data
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
    submit (form) {
      let username = this.form.username
      let password = this.form.password
      let region = this.form.region
      this.$refs[form].validate((valid) => {
        if (valid) { // 如果验证通过
          if (this.remember === true) { // 记住密码
            Cookies.set('dsName', username, { expires: 7 })
            Cookies.set('dsWord', password, { expires: 7 })
            Cookies.set('dsregion', region, { expires: 7 })
          } else {
            this.region = false
            Cookies.remove('dsName')
            Cookies.remove('dsWord')
            Cookies.remove('dsregion')
          }
          let dataStr = {
            appid: md5(username) + '_' + this.form.region,
            appsecert: this.form.password,
            userid: this.form.username,
            userpwd: this.form.password,
            loginDevice: 'dsbox_web'
          }
          let params = {
            url: 'http://192.168.1.34:1945/v3/getUserToker',
            data: dataStr,
            method: 'post',
            callback: res => {
              if (res.status === 200 && res.ret === 0) {
                res = res.data
                let token = res.accessToken
                let expiration = res.expiration
                sessionStorage.setItem('dsToken', token) // 存token
                sessionStorage.setItem('lifeTime', expiration) // 存过期时间
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '登录成功',
                  duration: 800
                })
                setTimeout(() => {
                  this.$router.push({ path: '/privatedoc' })
                }, 1000)
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '账号或密码错误',
                  duration: 1000
                })
              }
            },
            errcallback: msg => {
              console.log(msg)
            }
          }
          this.$http.sendRequest(params)
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '验证不通过',
            duration: 1000
          })
        }
      })
    }
  },
  created () {
    this.getFieldList()
    if (Cookies.get('dsName') != null) {
      this.form.username = Cookies.get('dsName') || ''
      this.form.password = Cookies.get('dsWord') || ''
      this.form.region = Cookies.get('dsregion') || ''
      this.remember = true
    } else {
      this.form.username = ''
      this.form.password = ''
      this.form.region = ''
      this.remember = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/mixins';
.login-wrapper {
  .bis('~images/bg.png');
  .login-box {
    .wh(400px, 370px);
    background-image: linear-gradient(
      -90deg,
      rgba(0, 0, 0, 0.28) 2%,
      rgba(0, 0, 0, 0.2) 28%,
      rgba(0, 0, 0, 0.13) 53%,
      rgba(0, 0, 0, 0.2) 78%,
      rgba(0, 0, 0, 0.28) 99%
    );
    box-shadow: 0 3px 7px 8px rgba(106, 169, 244, 0.23);
    border-radius: 25px;
    .login-title {
      .wh(230px, 40px);
      .ft(28px, 40px);
      margin-top: 31px;
      font-family: Silom;
      color: #ffffff;
      letter-spacing: 0.55px;
    }
    .el-form {
      width: 300px;
      position: absolute;
      top: 87px;
      .input-bg {
        display: block;
        .wh(20px, 20px);
        left: 16px;
      }
      .user-bg {
        background: url('~images/user.png') no-repeat center;
      }
      .word-bg {
        background: url('~images/lock.png') no-repeat center;
      }
      .field-bg {
        background: url('~images/field.png') no-repeat center;
      }
      .remember {
        height: 17px;
        .ft(12px, 17px);
        margin: 0 0 20px 10px;
        font-family: PingFangSC-Regular;
        color: #ffffff;
        letter-spacing: 0.44px;
        .check-box {
          .wh(84px, 17px);
          cursor: pointer;
        }
        .check-box input[type='checkbox'] {
          line-height: 17px;
          .wh(13px, 13px);
          cursor: pointer;
          background-color: #fff;
          -webkit-appearance: none;
          border-radius: 2px;
          outline: none;
        }
        .check-box input[type='checkbox']:checked {
          background: url('~images/select.png') no-repeat center;
        }
      }
      .submit {
        .wh(300px, 38px);
        .sc(18px, #fff);
        border: 0;
        background: #d0d0d0;
        border-radius: 26px;
        padding: 0;
        line-height: 38px;
        cursor: pointer;
      }
      .active {
        background-image: linear-gradient(
          -180deg,
          #7cd1ff 3%,
          #4a9efa 95%
        ) !important;
        border-radius: 26.5px;
      }
      .el-form-item {
        .wh(300px, 38px);
        margin-bottom: 17px;
      }
    }
    .title-bottom {
      .wh(150px, 20px);
      text-align: center;
      bottom: -23.8%;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0.88px;
    }
  }
}
</style>
<style lang="less">
.login-input {
  .el-input__inner {
    height: 38px;
    width: 300px;
    border-radius: 27px;
    position: relative;
    padding-left: 50px;
  }
  .el-form-item__error {
    padding: 2px 0px 2px 10px;
  }
}
</style>
