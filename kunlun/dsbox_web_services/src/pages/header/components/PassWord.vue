<template>
  <div>
    <el-dialog title="修改密码"
               center
               :visible.sync="dialogVisible"
               width="400px"
               :before-close="handleClose">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="81px">
        <el-form-item prop="oldWord"
                      label="旧密码：">
          <el-input type="password"
                    @input.native="handleChange"
                    placeholder="请输入旧密码"
                    v-model="form.oldWord"></el-input>
          <div class="el-form-item__error"
               v-if="errorWord">旧密码错误</div>
        </el-form-item>
        <el-form-item prop="newWord"
                      label="新密码：">
          <el-input type="password"
                    placeholder="请输入新密码"
                    v-model="form.newWord"></el-input>
        </el-form-item>
        <el-form-item prop="againWord"
                      label="确认密码：">
          <el-input type="password"
                    placeholder="请输入确认密码"
                    v-model="form.againWord"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-bottom">
        <el-button size="small"
                   plain
                   type="primary"
                   @click="submit">保 存</el-button>
        <el-button size="small"
                   type="primary"
                   plain
                   @click="userDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    wordDialogIndex: Number
  },
  data () {
    let validateOldWord = (rule, value, callback) => {
      if (!value) {
        callback(new Error('旧密码不能为空'))
      } else {
        callback()
      }
    }
    let validateNewWord = (rule, value, callback) => {
      let regExp = /^[0-9a-zA-Z_]{6,18}$/
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else {
        if (regExp.test(value) === false) {
          return callback(new Error('密码长度为6-18位；包含字母数字下划线'))
        }
        callback()
      }
    }
    let validateAgainWord = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else {
        if (this.form.newWord !== value) {
          return callback(new Error('新密码和确认密码不一致'))
        }
        callback()
      }
    }
    return {
      errorWord: false,
      dialogVisible: false,
      error: 0,
      form: {
        oldWord: '',
        newWord: '',
        againWord: ''
      },
      rules: {
        oldWord: [{ validator: validateOldWord, trigger: 'blur' }],
        newWord: [{ validator: validateNewWord, trigger: 'blur' }],
        againWord: [{ validator: validateAgainWord, trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
    },
    handleChange () {
      // var app = this // 改变作用域 计时器里面的this指向的是window
      // if (this.timer) {
      //   clearTimeout(this.timer)
      // }
      // this.timer = setTimeout(function () {
      //   app.getOldWord()
      // }, 200)
      this.errorWord = false
    },
    submit () {
      let params = {
        url: 'http://192.168.1.34:1945/v3/User/upUserPwd',
        method: 'post',
        data: {
          'oldpassword': this.form.oldWord,
          'password': this.form.againWord
        },
        callback: res => {
          if (res.status === 200 && res.ret === 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '密码修改成功',
              duration: 1000
            })
          } else {
            this.errorWord = true
            console.log(res)
          }
        },
        errcallback: msg => {
          console.log(msg)
        }
      }
      this.$http.sendRequest(params)
    }
  },
  watch: {
    wordDialogIndex () {
      if (this.wordDialogIndex !== -1) {
        this.dialogVisible = true
        if (this.$refs['form'] !== undefined) { // 当表单渲染进dom后对该表单项进行重置，将其值重置为初始值并移除校验结果
          this.$refs['form'].resetFields()
        }
        this.$emit('userchangedialog', -1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
