<!--
    by: ruizhesun 2018年09月05日
    name: 修改密码弹窗
    notes:
-->

<template>
<div class="changePwd">
  <el-dialog  :visible.sync="dialogFormVisible" :modal="true" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"  v-loading="loading" :show-close="false">
    <h2 slot="title">修改密码</h2>
    <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click.stop="resetForm('ruleForm')"><i class="el-dialog__close el-icon el-icon-close"></i></button>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
      <el-form-item label="原密码:" prop="oldPass" size="small">
        <el-input type="password" v-model="ruleForm.oldPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码:" prop="newPass" size="small">
        <el-input type="password" v-model="ruleForm.newPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码:" prop="checkPass" size="small">
        <el-input type="password" v-model="ruleForm.checkPass"></el-input>
      </el-form-item>
      <el-form-item>

        <div class="buttonFooter">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>

</div>
</template>
<script>
import passwordUrl from "@/libs/interface/public.js"
export default {
  props: {
    dialogFormVisible: false,
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };

    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          callback(new Error('密码只能包含数字与字母(大小写不限)'));
        } else {
          if (value.length < 6 || value.length > 6) {
            callback(new Error('密码长度只能为6位'));
          } else {
            if (this.ruleForm.checkPass !== '') {
              this.$refs.ruleForm.validateField('checkPass');
            }
          }
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      loading: false,

      rules: {
        oldPass: [{
          validator: validatePass1,
          trigger: 'blur'
        }],
        checkPass: [{
          validator: validatePass2,
          trigger: 'blur'
        }],
        newPass: [{
          validator: validatePass,
          trigger: 'blur'
        }]
      },
    }
  },

  methods: {
    onClose(){
      this.$emit("resetPwdDialogClose", "");
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var changePwd = new FormData();

          changePwd.append('oldPwd',this.$md5("iflytek2018_md5" + this.ruleForm.oldPass))
          this.loading = true
          this.$ajax.post(passwordUrl.checkOldPassword,changePwd ).then((res) => {
            let data = this.$ajaxCheck(res)
            if (!data) return
            changePwd.append('newPwd',this.$md5("iflytek2018_md5" + this.ruleForm.newPass))
            this.$ajax.post(passwordUrl.checkChangePassword,changePwd).then((res) => {
              let data = this.$ajaxCheck(res)
              if (!data) return

              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.$emit("resetPwdDialogClose", "")
              this.$refs[formName].resetFields();

            }).catch(err => {
              this.$ajaxError(err)
            }).finally(ok => {
              this.loading = false
            })

          }).catch(err => {
            this.$ajaxError(err)
          }).finally(ok => {
            this.loading = false
          })
          this.loading = true
        } else {

          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit("resetPwdDialogClose", "")
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";
.changePwd {
    .ruleForm {
        width: 488px;
        height: 280px;
        .baseBorder();
        border-left: 0;
        border-right: 0;
        padding-top: 32px;
        padding-bottom: 10px;
        padding-right: 30px;
    }
    .buttonFooter {
        float: right;
        padding: 16px;
        height: 72px;
    }
}
</style>
<style lang="less">
.changePwd {
    .el-dialog {
        width: 488px!important;
    }
    .el-dialog__body {
        padding: 0;
    }
    .el-dialog__title {
        font-weight: bold;
    }

}
</style>
