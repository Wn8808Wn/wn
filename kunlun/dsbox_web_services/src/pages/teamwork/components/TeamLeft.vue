<template>
  <div>
    <!-- 搜索 -->
    <div class="group-search">
      <el-input placeholder="请输入群组名称搜索"
                prefix-icon="el-icon-search"
                v-model="search">
      </el-input>
    </div>
    <!-- 群组列表 -->
    <el-menu style="min-height:100%"
             unique-opened
             router
             :default-active="$route.path">
      <el-submenu index="1">
        <template slot="title">
          <span>我创建的群</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/teamwork"
                        v-for="item of createGroupList"
                        :key="item.gid"><img :src="item.gicon">{{item.gname}}
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="item.gid">群设置</el-dropdown-item>
                <el-dropdown-item :command="item.gid">群成员</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <span>我加入的群</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/teamwork"
                        v-for="item of addGroupList"
                        :key="item.gid"><img :src="item.gicon">{{item.gname}}
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="item.gid">群设置</el-dropdown-item>
                <el-dropdown-item :command="item.gid">群成员</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <!-- 群设置弹窗 -->
    <el-dialog title="群设置"
               :visible.sync="dialogVisible"
               class="group-wrapper"
               width="460px">
      <el-form ref="group"
               :rules="rules"
               :model="group"
               label-width="97px"
               class="group-form">
        <el-form-item label="群名称："
                      prop="name">
          <el-input placeholder="请输入群名称"
                    v-model="group.name"></el-input>
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
              <el-button size="small"
                         type="primary">上传图片</el-button>
              <div slot="tip"
                   class="el-upload__tip">支持jpg、jpeg、png格式的图片，文件小于2M</div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="群描述："
                      prop="desc">
          <el-input type="textarea"
                    placeholder="描述不可超过50个字"
                    v-model="group.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('group')">保存</el-button>
          <el-button type="danger"
                     @click="deleteDialog">删除群</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 删除群弹窗 -->
    <el-dialog :visible.sync="dialogDelete">
      <span>您确定要删除群吗？
        群删除成员解散，群文件不可恢复
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="deleteGroup">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'teamleft',
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
      search: '',
      gid: '',
      createGroupList: [], // 创建群列表
      addGroupList: [], // 加入群列表
      dialogVisible: false, // 群设置弹窗
      dialogDelete: false, // 删除群弹窗
      group: { name: '', file: '', desc: '' },
      imageUrl: require('../../../assets/images/group_tx.png'),
      rules: { name: [{ validator: validateName, trigger: 'blur' }], desc: [{ validator: validateDesc, trigger: 'blur' }] }
    }
  },
  methods: {
    getCreateGroup () { // 获取创建群列表
      let params = {
        url: 'http://192.168.1.34:1945/v3/Group/getGroups/0/1000/1',
        data: {},
        method: 'post',
        callback: res => {
          if (res.status === 200 && res.ret === 0) {
            this.createGroupList = res.data
          }
        },
        errcallback: msg => {
          console.log(msg)
        }
      }
      this.$http.sendRequest(params)
    },
    getAddGroup () { // 获取加入群列表
      let params = {
        url: 'http://192.168.1.34:1945/v3/Group/getGroups/1/1000/1',
        data: {},
        method: 'post',
        callback: res => {
          if (res.status === 200 && res.ret === 0) {
            this.addGroupList = res.data
          }
        },
        errcallback: msg => {
          console.log(msg)
        }
      }
      this.$http.sendRequest(params)
    },
    handleCommand (command) { // 点击弹出群设置弹窗，并获取当前群的详情
      let params = {
        url: 'http://192.168.1.34:1945/v3/Group/getGroup/' + command,
        data: {},
        method: 'post',
        callback: res => {
          if (res.status === 200 && res.ret === 0) {
            if (this.$refs['group'] !== undefined) {
              this.$refs['group'].clearValidate()
            }
            this.gid = res.data.gid
            this.group.name = res.data.gname
            this.group.file = res.data.gicon
            this.group.desc = res.data.gdesc
            this.imageUrl = res.data.gicon
            this.dialogVisible = true
          }
        },
        errcallback: msg => {
          console.log(msg)
        }
      }
      this.$http.sendRequest(params)
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
    submitGroup () { // 编辑群
      let params = {
        url: 'http://192.168.1.34:1945/v3/Group/updateGroup',
        data: {
          'gid': this.gid,
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
              message: '群编辑成功',
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
    deleteDialog () { // 删除群弹窗出现
      this.dialogVisible = false
      this.dialogDelete = true
    },
    deleteGroup () { // 删除群调取接口
      let params = {
        url: 'http://192.168.1.34:1945/v3/Group/deleteGroup/' + this.gid,
        data: {},
        method: 'post',
        callback: res => {
          if (res.status === 200 && res.ret === 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '删除成功',
              duration: 800
            })
            this.dialogDelete = false
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
  },
  mounted () {
    this.getCreateGroup()
    this.getAddGroup()
  }
}
</script>

<style lang="less">
@import '~styles/mixins';
.group-search {
  .wh(220px, 40px);
  background: #f5f5f5;
  .el-input__inner {
    .wh(202px, 30px);
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    margin: 5px 9px;
  }
  .el-input__prefix {
    left: 15px;
  }
}
.group-form {
  width: 397px;
  .icon-wrapper {
    overflow: hidden;
    .icon-tx {
      float: left;
      img {
        .wh(48px, 48px);
      }
    }
    .icon-upload {
      float: right;
      .el-upload__tip {
        margin-top: -10px;
      }
    }
  }
}
</style>
