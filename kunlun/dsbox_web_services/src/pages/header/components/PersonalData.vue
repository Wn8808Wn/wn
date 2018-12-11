<template>
  <div>
    <el-dialog title="个人资料"
               center
               :visible.sync="userDialog"
               width="460px"
               :before-close="handleClose">
      <el-form :model="form"
               :ref="form"
               :rules="rules"
               class="user-form"
               label-width="80px">
        <el-form-item class="photo"
                      label="个人头像：">
          <div class="touxiang fl">
            <img :src="imgUrl"
                 alt="头像" />
          </div>
          <el-upload class="upload-box fl"
                     action="#">
            <el-button size="mini">上传头像</el-button>
            <div slot="tip"
                 class="el-upload__tip">支持jpg、jpeg、png格式的图片，文件小于2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="账号：">
          <span>{{form.username}}</span>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="生日：">
          <el-date-picker class="date-picker"
                          style="width: 100%"
                          v-model="form.date"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址：">
          <v-distpicker :province="form.sheng"
                        :city="form.city"
                        :area="form.area"
                        @selected=selected></v-distpicker>
        </el-form-item>
        <el-form-item class="textarea-box"
                      label="详细地址：">
          <el-input resize="none"
                    type="textarea"
                    v-model="form.address"></el-input>
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
  name: 'personaldata',
  props: {
    userDialogIndex: Number,
    userData: Array
  },
  data () {
    return {
      userDialog: false,
      imgUrl: require('../../../assets/images/photo.png'),
      form: {
        username: '',
        name: '',
        sex: 0,
        phone: '',
        email: '',
        date: '',
        sheng: '',
        city: '',
        area: '',
        address: ''
      },
      rules: {},
      allArea: ''
    }
  },
  components: {
    VDistpicker: () => import('v-distpicker')
  },
  methods: {
    handleClose () {
      this.userDialog = false
    },
    selected (data) {
      this.allArea = data.province.value + '/' + data.city.value + '/' + data.area.value
    },
    submit () { // 保存
      let data = {
        'name': `${this.form.name}`,
        'sex': `${this.form.sex}`,
        'phone': `${this.form.phone}`,
        'email': `${this.form.email}`,
        'birthday': `${(this.form.date).toLocaleDateString()}`,
        'city': `${this.allArea}`,
        'address': `${this.form.address}`
      }
      let jsonStr = JSON.stringify(data)
      let params = {
        url: 'http://192.168.1.34:1945/v3/User/updateUserInfo',
        method: 'post',
        data: jsonStr,
        callback: res => {
          if (res.status === 200 && res.ret === 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '资料修改成功',
              duration: 1000
            })
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
    userDialogIndex () { // 接收父组件传过来的数字判断是否开启弹窗
      if (this.userDialogIndex !== -1) {
        this.userDialog = true
        if (this.$refs['form'] !== undefined) { // 当表单渲染进dom后对该表单项进行重置，将其值重置为初始值并移除校验结果
          this.$refs['form'].resetFields()
        }
        this.$emit('userchangedialog', -1)
      }
    },
    userData () { //  当用户数据改变的时候更新
      if (this.userData) {
        let user = this.userData[0]
        this.form.username = user.username
        this.form.name = user.name
        this.form.sex = user.sex
        this.form.phone = user.phone
        this.form.email = user.email
        this.form.date = Date(user.birthday) // 把获取的字符串转成标准时间
        this.form.address = user.address
      }
    }
  },
  mounted () {
    // 页面挂载的时候读取用户数据
    let user = this.userData[0]
    let add = user.city
    this.form.username = user.username
    this.form.name = user.name
    this.form.sex = user.sex
    this.form.phone = user.phone
    this.form.email = user.email
    this.form.date = user.birthday
    this.form.address = user.address
    if (add) {
      this.form.sheng = add.split('/')[0]
      this.form.city = add.split('/')[1]
      this.form.area = add.split('/')[2]
    } else {
      this.form.sheng = '省'
      this.form.city = '市'
      this.form.area = '区'
    }
  }
}
</script>

<style lang="less" scoped>
@import '~styles/mixins.less';
</style>
