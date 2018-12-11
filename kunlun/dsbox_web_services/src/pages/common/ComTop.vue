<template>
  <div>
    <div class="upload icon"
         @click="handleClick(0)"
         :class="{active: 0 == nowActive}">
      <span>
        <i class="icon-img"></i>
        上传
      </span>
    </div>
    <div class="newadd icon"
         @click="handleClick(1)"
         :class="{active: 1 == nowActive}">
      <el-dropdown placement="top"
                   trigger="click">
        <span>
          <i class="icon-img"></i>
          新建
          <u class="el-icon-arrow-down el-icon--right"></u>
        </span>
        <el-dropdown-menu class="add-dropdown"
                          slot="dropdown">
          <el-dropdown-item>
            <span class="bg-icon folder fl"></span>
            <span class="fl">文件夹</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span class="bg-icon text fl"></span>
            <span class="fl">笔记</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span class="bg-icon word fl"></span>
            <span class="fl">word</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span class="bg-icon excel fl"></span>
            <span class="fl">excel</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span class="bg-icon ppt fl"></span>
            <span class="fl">ppt</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="share icon"
         @click="handleClick(2)"
         :class="{active: 2 == nowActive}">
      <span>
        <i class="icon-img"></i>
        分享
      </span>
    </div>
    <div class="more icon"
         @click="handleClick(3)"
         :class="{active: 3 == nowActive}">
      <el-dropdown placement="top"
                   trigger="click">
        <span>
          <i class="icon-img"></i>
          更多
          <u class="el-icon-arrow-down el-icon--right"></u>
        </span>
        <el-dropdown-menu class="add-dropdown"
                          slot="dropdown">
          <el-dropdown-item>下载</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
          <el-dropdown-item>移动到</el-dropdown-item>
          <el-dropdown-item>复制到</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nowActive: null
    }
  },
  methods: {
    handleClick (num) {
      this.nowActive = num
    }
  }
}
</script>

<style lang="less" scoped>
@import '~styles/mixins';
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
  position: relative;
  cursor: pointer;
  letter-spacing: 0.19px;
  .sc(14px, #5c9ae5);
  .icon-img {
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
.upload .icon-img {
  background: url('~images/upload.png') no-repeat center;
}
.newadd .icon-img {
  background: url('~images/add.png') no-repeat center;
}
.share .icon-img {
  background: url('~images/fx.png') no-repeat center;
}
.more .icon-img {
  background: url('~images/share.png') no-repeat center;
}
.active {
  background: #ecf5ff;
}
// 新建按钮下拉框
.add-dropdown {
  .el-dropdown-menu__item {
    .wh(100px, 34px);
    .bg-icon {
      display: block;
      margin-top: 8px;
      margin-right: 10px;
      .wh(15px, 17px);
    }
    .folder {
      .wh(17px, 15px);
       margin-top: 10px;
      background: url('~images/folder.png') no-repeat;
      background-size: 100% 100%;
    }
    .text {
      background: url('~images/text.png') no-repeat;
      background-size: 100% 100%;
    }
    .word {
      background: url('~images/word.png') no-repeat;
      background-size: 100% 100%;
    }
    .excel {
      background: url('~images/excel.png') no-repeat;
      background-size: 100% 100%;
    }
    .ppt {
      background: url('~images/pdf.png') no-repeat;
      background-size: 100% 100%;
    }

  }
}
</style>
