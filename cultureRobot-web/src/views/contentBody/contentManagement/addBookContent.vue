<!--
    by: yingdong 2018年08月31日
    name: 新增和编辑书籍类内容
    notes:
-->
<template lang="html">
    <div class="" v-loading="editLoading">
        <div class="breadcrumbArea">
          <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>内容管理</el-breadcrumb-item>
              <el-breadcrumb-item>新增内容</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" class="backBtn" @click="goBack">返回</el-button>
        </div>
        <div class="baseInfo">
            <div class="baseInfoTit">基本信息</div>
            <div class="baseInfoCon">
              <el-form :model="baseInfoForm" :rules="rules" ref="baseInfoForm" label-width="130px" class="baseInfoForm">
                  <el-form-item label="内容名称：" prop="name">
                      <el-input v-model="baseInfoForm.name" placeholder="不多于40个字符"></el-input>
                  </el-form-item>
                  <el-form-item label="模块：" prop="moduleID">
                      <el-select v-model="baseInfoForm.moduleID" placeholder="请选择模块" @change="changeModule">
                          <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in moudleList"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="置顶页面列表：" prop="top">
                      <el-radio-group v-model="baseInfoForm.top">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="描述：" style="width:95%;" class="decriptionBox">
                      <el-input type="textarea" v-model="baseInfoForm.description"></el-input>
                  </el-form-item>
              </el-form>
            </div>
        </div>
        <div class="detailInfo" v-show="baseInfoForm.moduleID">
            <div class="detailInfoTit">详细信息</div>
            <div class="detailArea">
                <div class="facePicArea">
                    <div class="faceText" v-show="!baseInfoForm.coverPath">书籍封面</div>
                    <img :src="context.host+baseInfoForm.coverPath" alt="" v-show="baseInfoForm.coverPath">
                    <el-select v-model="baseInfoForm.cover" filterable placeholder="请选择" style="width:326px;margin-top:16px;"
                    @change="changeCover">
                        <el-option
                          v-for="item in coverList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.path">
                        </el-option>
                    </el-select>
                </div>
                <div class="infoArea">
                    <el-form :model="detailInfoForm" :rules="ruleDetail" ref="detailInfoForm" label-width="137px" class="detailInfoForm">
                        <el-form-item label="书籍名称：" prop="name">
                            <el-input v-model="detailInfoForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="所属类别：" prop="category">
                            <el-input v-model="detailInfoForm.category"></el-input>
                        </el-form-item>
                        <el-form-item label="作者：" prop="author">
                            <el-input v-model="detailInfoForm.author"></el-input>
                        </el-form-item>
                        <el-form-item label="ISBN：" prop="isbn">
                            <el-input v-model="detailInfoForm.isbn"></el-input>
                        </el-form-item>
                        <el-form-item label="出版年：" prop="year">
                            <el-input v-model="detailInfoForm.year"></el-input>
                        </el-form-item>
                        <el-form-item label="分类号：">
                            <el-input v-model="detailInfoForm.categoryNo"></el-input>
                        </el-form-item>
                        <el-form-item label="出版社：" prop="press">
                            <el-input v-model="detailInfoForm.press"></el-input>
                        </el-form-item>
                        <el-form-item label="位置：">
                            <el-input v-model="detailInfoForm.location"></el-input>
                        </el-form-item>
                        <el-form-item label="适读年龄："  prop="age">
                            <el-input v-model="detailInfoForm.age"></el-input>
                        </el-form-item>
                        <el-form-item label="作者简介：" prop="authorDesc" style="width:417px;" class="decriptionBox">
                            <el-input type="textarea" v-model="detailInfoForm.authorDesc"></el-input>
                        </el-form-item>
                        <el-form-item label="内容简介：" prop="contentDesc" style="width:417px;" class="decriptionBox">
                            <el-input type="textarea" v-model="detailInfoForm.contentDesc"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="btnsArea" v-show="baseInfoForm.moduleID">
            <el-button size="medium" type="primary" @click="submitForm('baseInfoForm')">保存</el-button>
            <el-button size="medium" @click="goBack">取消</el-button>
        </div>
    </div>
</template>

<script>
import dataUrl from '@/libs/interface/contentManagement/addContent.js';
import context from "@/libs/interface/context.js";
export default {
    data(){
        var validateName = (rule, value, callback) => {
            var value = value.trim();
            if (value === '') {
                callback(new Error('请输入内容名称'));
            } else if (value.length > 40) {
                callback(new Error('内容名称不可大于40个字符'));
            }else if(value.length>0 && value.length<=40){
                callback();
            } else {
                callback();
            }
        };
        var validSpace = (rule, value, callback)=>{
            var value = value.trim();
            if(!value){
                callback(new Error('此项为必填项'));
            }else{
                callback();
            }
        };
        return {
            context:context,
          baseInfoForm: {
              id:'',
              name: '',
              moduleID: '',
              type:"3",// 1，2-》知识库 3书籍

              top:"否",
              description:"",
              cover:"",//封面
              coverPath:""
          },
          editLoading:false,//编辑的加载
          moudleList:[],//模块列表
          coverList:[],//封面列表
          rules: {
              name: [
                  { required: true, validator: validateName, trigger: 'blur' },
              ],
              moduleID: [
                  { required: true, message: '请选择模块', trigger: 'change' }
              ],
              top: [
                  { required: true, message: '请选择是否置顶页面', trigger: 'change' }
              ],
              description: [
                  { required: true, message: '请添加描述', trigger: 'change' },
                  { validator: validSpace, trigger: 'blur' }
              ]
          },
          currentModuleName:'',//当前模块名称
          searchName:'',//资源搜索内容
          resLoading:false,//资源列表区域的加载
          submitLoading:false,
          detailInfoForm:{
              name: "",
              author: "",
              year: "",
              press: "",
              age: "",
              contentDesc: "",
              category: "",
              isbn: "",
              categoryNo: "",
              location: "",
              authorDesc: "",
              cover: ""
          },
          ruleDetail: {
              name: [
                  { required: true, message: '请输入书籍名称', trigger: 'blur' },
                  { validator: validSpace, trigger: 'blur' }
              ],
              category: [
                  { required: true, message: '请输入所属类别', trigger: 'blur' },
                  { validator: validSpace, trigger: 'blur' }
              ],
              author: [
                  { required: true, message: '请输入作者', trigger: 'blur' },
                  { validator: validSpace, trigger: 'blur' }
              ],
              isbn: [
                  { required: true, message: '请输入ISBN', trigger: 'blur' },
                  { validator: validSpace, trigger: 'blur' }
              ],
              year: [
                  { required: true, message: '请输入出版年', trigger: 'blur' },
                  { validator: validSpace, trigger: 'blur' }
              ],
              press:[
                  { required: true, message: '请输入出版社', trigger: 'blur' },
                  { validator: validSpace, trigger: 'blur' }
              ],
              age:[
                  { required: true, message: '请输入试读年龄', trigger: 'blur' },
                  { validator: validSpace, trigger: 'blur' }
              ],
              authorDesc:[
                  { required: true, message: '请添加作者简介', trigger: 'blur' },
                  { validator: validSpace, trigger: 'blur' }
              ],
              contentDesc:[
                  { required: true, message: '请添加内容简介', trigger: 'blur' },
                  { validator: validSpace, trigger: 'blur' }
              ]
          },
        }
    },
    mounted(){
        this.loadMoudleList();
        this.baseInfoForm.id = this.$route.query.id?this.$route.query.id:"";
        if(this.baseInfoForm.id){//编辑
            this.loadContent();
        }
    },
    methods:{
        loadContent(){
            this.editLoading = true;
            this.$ajax.get(dataUrl.findContentUrl,{
                params:{
                    id:this.baseInfoForm.id,
                    type:"1"//1书籍 2非书籍
                }
            }).then((res) => {
                let data = this.$ajaxCheck(res)
                if (!data) return
                this.editLoading = false;
                this.$nextTick(tick=>{
                    this.initEditInfo(data);
                })
            }).catch(err => {
                this.$ajaxError(err)
                this.editLoading = false;
            }).finally(ok => {
            })
        },
        //初始化编辑数据
        initEditInfo(_data){
            this.baseInfoForm.name = _data.name;
            this.baseInfoForm.moduleID = _data.moduleID;
            this.baseInfoForm.top = _data.book.top==1?'是':'否';
            this.baseInfoForm.description =  _data.book.description;
            this.baseInfoForm.coverPath = _data.book.cover;
            this.baseInfoForm.cover = _data.book.cover;
            this.detailInfoForm = _data.book;
            this.loadCoverList();
        },
        //加载模块列表
        loadMoudleList(){
            this.$ajax.get(dataUrl.moudleList,{
                params:{
                    bookTag:"1"//1书籍 2非书籍
                }
            }).then((res) => {
                let data = this.$ajaxCheck(res)
                if (!data) return
                this.moudleList = data.dataList;
            }).catch(err => {
                this.$ajaxError(err)
            }).finally(ok => {
            })
        },
        //获取封面列表
        loadCoverList(){
            this.$ajax.get(dataUrl.coverListUrl+"/"+this.baseInfoForm.moduleID+"/0").then((res) => {
                let data = this.$ajaxCheck(res)
                if (!data) return
                this.coverList = data;
                if(this.baseInfoForm.id){
                    this.changeCover();
                }
            }).catch(err => {
                this.$ajaxError(err)
            }).finally(ok => {
            })
        },
        //切换模块
        changeModule(_id){
            if(_id){
                this.baseInfoForm.moduleID = _id;
                this.baseInfoForm.coverPath = '';
                this.baseInfoForm.cover = '';
                this.loadCoverList();
            }
            this.moudleList.forEach(item=>{
                if(item.id == _id){
                    this.currentModuleName = item.name;
                }
            })
        },
        //实时搜索资源
        searchResEvent(){
            this.loadResList();
        },
        //保存前验证
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$refs['detailInfoForm'].validate((valid) => {
                        if(valid){
                            this.submitSave();

                        }
                    })
                }
            });
        },
        //提交保存
        submitSave(){
            var subData = {
                id:'',
                name: '',
                moduleID: '',
                type:"3",
                book:{
                    top:"",
                    description:"",
                    name: "",
                    author: "",
                    year: "",
                    press: "",
                    age: "",
                    contentDesc: "",
                    category: "",
                    isbn: "",
                    categoryNo: "",
                    location: "",
                    authorDesc: "",
                    cover: ""
                },
            };
            subData.id = this.baseInfoForm.id;
            subData.name = this.baseInfoForm.name;
            subData.moduleID = this.baseInfoForm.moduleID;
            subData.type = '1',
            subData.book.top = this.baseInfoForm.top=='是'?"1":"2";
            subData.book.description = this.baseInfoForm.description;
            subData.book.name = this.detailInfoForm.name;
            subData.book.author = this.detailInfoForm.author;
            subData.book.year = this.detailInfoForm.year;
            subData.book.press = this.detailInfoForm.press;
            subData.book.age = this.detailInfoForm.age;
            subData.book.contentDesc = this.detailInfoForm.contentDesc;
            subData.book.category = this.detailInfoForm.category;
            subData.book.isbn = this.detailInfoForm.isbn;
            subData.book.categoryNo = this.detailInfoForm.categoryNo;
            subData.book.location = this.detailInfoForm.location;
            subData.book.authorDesc = this.detailInfoForm.authorDesc;
            subData.book.cover = this.baseInfoForm.cover;
            this.submitLoading = true;
            this.$ajax.get(dataUrl.addOrUpdateUrl,{
                params:{
                    json:JSON.stringify(subData)
                }
            }).then((res) => {
                let data = this.$ajaxCheck(res);
                if (!data) return
                this.submitLoading = false;
                this.$message.success('保存成功！');
                this.$nextTick(tick=>{
                    this.$emit("changeview",'backButton');
                });
            }).catch(err => {
                this.$ajaxError(err)
            }).finally(ok => {
                this.submitLoading = false;
            })
        },
        //返回
        goBack(){
            this.$emit("changeview","backButton");
        },
        changeCover(){
            this.coverList.forEach(item=>{
                if(item.path == this.baseInfoForm.cover){
                    this.baseInfoForm.coverPath = item.path;
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";
.breadcrumbArea{
    position: relative;
    .el-breadcrumb{
        line-height: 36px;
        height:36px;
    }
}
.baseInfo{
    width:100%;
    height:310px;
    background:#fff;
    .baseBorder;
    padding: 16px;
    .baseInfoTit{
        font-size: 16px;
        font-weight: bold;
    }
    .baseInfoForm{
        padding: 16px 150px 0 150px;
        .el-form-item{
            width:488px;
            float: left;
        }
        .el-select{
            width:100%;
        }
    }

}
.detailInfo{
    width:100%;
    // height:546px;
    float:left;
    background-color: #fff;
    .baseBorder;
    padding: 24px;
    margin-top:16px;
    .detailInfoTit{
        font-size: 16px;
        font-weight: bold;
    }
    .detailArea{
        margin-top: 16px;
        width:100%;
        // height:406px;
        clear: both;
        .facePicArea{
            width:326px;
            height:186px;
            background:#f0f2f1;
            text-align:center;
            font-size:14px;
            float: left;
            .faceText{
                line-height:186px;
            }
            img{
                display: inline-block;
                width:100%;
                height:100%;
            }
        }
        .infoArea{
            float: left;
            width:calc(~'100% - '330px);
            height:100%;
        }
    }
}
.detailInfoForm{
    clear: both;
    .el-form-item{
        width:417px;
        float: left;
    }
}
.el-icon-check{
    font-size: 20px;
    font-weight: bold;
    color:#00CC7A;
}
.btnsArea{
    margin-top:16px;
    float: left;
    .el-button{
        width:128px;
    }
}
</style>
