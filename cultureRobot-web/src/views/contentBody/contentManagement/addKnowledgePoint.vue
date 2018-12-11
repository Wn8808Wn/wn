<!--
    by: yingdong 2018年08月28日
    name: 新增和创建非书籍类内容
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
                  <el-form-item label="标准问：" prop="question">
                      <el-input v-model="baseInfoForm.question" placeholder="不多于128个字符"></el-input>
                  </el-form-item>
                  <el-form-item label="标准答案：" prop="answer">
                      <el-input v-model="baseInfoForm.answer" placeholder="请输入答案"></el-input>
                  </el-form-item>
                  <el-form-item label="目录：" prop="direction">
                      <el-select v-model="baseInfoForm.direction" placeholder="请选择知识问答存储位置">
                          <el-option :label="item.dicKey" :value="item.dicValue" :key="item.dicValue" v-for="item in drctionList"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="关联到知识库：" prop="relate">
                      <el-radio-group v-model="baseInfoForm.relate">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="置顶页面列表：" prop="top">
                      <el-radio-group v-model="baseInfoForm.top">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="描述：" style="width:640px;" class="decriptionBox">
                      <el-input type="textarea" v-model="baseInfoForm.description"></el-input>
                  </el-form-item>
                  <!-- <el-form-item>
                    <el-button type="primary">立即创建</el-button>
                    <el-button @click="resetForm('baseInfoForm')">重置</el-button>
                  </el-form-item> -->
              </el-form>
            </div>
        </div>
        <div class="selectRes" v-show="baseInfoForm.moduleID">
            <div class="selectResTit"><span>*</span>选择资源</div>
            <div class="resArea">
                <div class="noCheckList">
                    <div class="noCheckListTit">
                        <div class="">模块：<span class="moduleName" :title="currentModuleName">{{currentModuleName}}</span></div>
                        <div class="searchRes">
                            <el-input v-model="searchName" placeholder="输入资源名称搜索" suffix-icon="el-icon-search" size="mini" :fetch-suggestions="searchResEvent"></el-input>
                        </div>
                    </div>
                    <div class="tableArea tableAreaLeft" v-loading="resLoading">
                        <el-table
                            :data="noCheckList"
                            empty-text="请到资源管理菜单创建资源"
                            border
                            stripe
                            height="399"
                            style="width: 100%">
                            <el-table-column
                              prop="id"
                              label="资源ID"
                              width="110">
                            </el-table-column>
                            <el-table-column
                              prop="resourceName"
                              label="资源名称"
                              width="180">
                            </el-table-column>
                            <el-table-column
                              prop="noPic"
                              label="视频">
                              <template slot-scope="scope" v-if="scope.row.isVideo">
                                <i class="el-icon-check"></i>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="noVideo"
                              label="图片">
                              <template slot-scope="scope" v-if="scope.row.isPic">
                                <i class="el-icon-check"></i>
                              </template>
                            </el-table-column>
                            <el-table-column
                               fixed="right"
                               label="操作"
                               width="100">
                               <template slot-scope="scope">
                                 <el-button @click="handleSelect(scope.row)" type="text" size="small">选择</el-button>
                               </template>
                             </el-table-column>
                          </el-table>
                    </div>
                </div>
                <div class="checkList">
                    <div class="checkListTit">
                        <div class="">已选</div>
                        <div class="clearAll">
                            <el-button size="mini" @click="clearAllEvent">清空</el-button>
                        </div>
                    </div>
                    <div class="tableArea">
                        <el-table
                            :data="checkList"
                            border
                            stripe
                            height="399"
                            style="width: 100%">
                            <el-table-column
                              prop="id"
                              label="资源ID"
                              width="110">
                            </el-table-column>
                            <el-table-column
                              prop="resourceName"
                              label="资源名称"
                              width="180">
                            </el-table-column>
                            <el-table-column
                              prop="noPic"
                              label="视频">
                              <template slot-scope="scope" v-if="scope.row.isVideo">
                                <i class="el-icon-check"></i>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="noVideo"
                              label="图片">
                              <template slot-scope="scope" v-if="scope.row.isPic">
                                <i class="el-icon-check"></i>
                              </template>
                            </el-table-column>
                            <el-table-column
                               fixed="right"
                               label="操作"
                               width="100">
                               <template slot-scope="scope">
                                 <el-button @click="handleCancel(scope.row)" type="text" size="small">取消</el-button>
                               </template>
                             </el-table-column>
                          </el-table>
                    </div>
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
export default {
    data(){
        var validateName = (rule, value, callback) => {
            var value = value.trim();
            if (value === '') {
                callback(new Error('请输入内容名称'));
            } else if (value.length > 40) {
                callback(new Error('内容名称不可大于20个字符'));
            }else if(value.length>0 && value.length<=40){
                callback();
            } else {
                callback();
            }
        };
        var validateQuestion = (rule, value, callback) => {
            var value = value.trim();
            if (value === '') {
                callback(new Error('请输入标准问'));
            } else if (value.length > 128) {
                callback(new Error('标准问不可大于128个字符'));
            }else if(value.length>0 && value.length<=128){
                callback();
            } else {
                callback();
            }
        };
        var validateAnswer = (rule, value, callback) => {
            var value = value.trim();
            if (value === '') {
                callback(new Error('请输入答案'));
            } else if (value.length > 1000) {
                callback(new Error('标准问不可大于1000个字符'));
            }else if(value.length>0 && value.length<=1000){
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
          baseInfoForm: {
              id:'',
              name: '',
              moduleID: '',
              type:"2",// 1，2-》知识库 3书籍

              question:"",
              answer:"",
              direction:"",
              top:"否",
              description:"",
              relate:"否",
              resourceIDList:[],

          },
          editLoading:false,//编辑的加载
          moudleList:[],//模块列表
          drctionList:[],//目录列表
          rules: {
              name: [
                  { required: true, validator: validateName, trigger: 'blur' },
              ],
              moduleID: [
                  { required: true, message: '请选择模块', trigger: 'change' }
              ],
              question:[
                  { required: true, validator: validateQuestion, trigger: 'blur' },
              ],
              answer:[
                  { required: true,validator: validateAnswer, trigger: 'blur' }
              ],
              direction: [
                  { required: true, message: '请选择知识问答存储位置', trigger: 'change' }
              ],
              relate: [
                  { required: true, message: '请选择是否关联知识库', trigger: 'change' }
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
          // noCheckList:[],//没选择的资源列表
          allNoCheckList:[],//全部未选资源
          checkList:[],//已选择的资源列表
          checkListIds:[],//已选资源的id
        }
    },
    computed:{
      noCheckList:function(){
        var search = this.searchName;
        if(search){
          return  this.allNoCheckList.filter((dataNews)=>{
            return Object.keys(dataNews).some((key)=>{
              if(key == 'resourceName'){
                  return String(dataNews[key]).toLowerCase().indexOf(search) > -1
              }
            })
          })
        }
        return this.allNoCheckList;
      }
    },
    mounted(){
        this.loadMoudleList();
        this.loadDerctionList();
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
                    type:"2"//1书籍 2非书籍
                }
            }).then((res) => {
                let data = this.$ajaxCheck(res)
                if (!data) return
                this.editLoading = false;
                this.initEditInfo(data);
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
            this.baseInfoForm.question = _data.knowledgePoint.question;
            this.baseInfoForm.answer =  _data.knowledgePoint.answer;
            this.baseInfoForm.direction = _data.knowledgePoint.direction;
            this.baseInfoForm.top = _data.knowledgePoint.top=='1'?'是':'否';
            this.baseInfoForm.description =  _data.knowledgePoint.description;
            this.baseInfoForm.relate = _data.relate=='1'?'是':'否';
            this.allNoCheckList = _data.knowledgePoint.resourceIDList.noCheckList;
            this.checkList = _data.knowledgePoint.resourceIDList.checkList;
            this.$nextTick(tick=>{
                this.allNoCheckList.forEach(item=>{
                    if(item.resourceFormat == "0"){
                        this.$set(item,'isPic',true);
                        this.$set(item,'isVideo',false);
                        this.$set(item,'noVideo','--');
                    }else if(item.resourceFormat == "1"){
                        this.$set(item,'isVideo',true);
                        this.$set(item,'isPic',false);
                        this.$set(item,'noPic','--');
                    }
                })
                this.checkList.forEach(item=>{
                    if(item.resourceFormat == "0"){
                        this.$set(item,'isPic',true);
                        this.$set(item,'isVideo',false);
                        this.$set(item,'noVideo','--');
                    }else if(item.resourceFormat == "1"){
                        this.$set(item,'isVideo',true);
                        this.$set(item,'isPic',false);
                        this.$set(item,'noPic','--');
                    }
                })
            })
        },
        //加载模块列表
        loadMoudleList(){
            this.$ajax.get(dataUrl.moudleList,{
                params:{
                    bookTag:"2"//1书籍 2非书籍
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
        //获取目录列表
        loadDerctionList(){
            this.$ajax.get(dataUrl.derectionUrl,{
                param:{
                    groupNo:1000001
                }
            }).then((res) => {
                let data = this.$ajaxCheck(res)
                if (!data) return
                this.drctionList = data.dataList;
            }).catch(err => {
                this.$ajaxError(err)
            }).finally(ok => {
            })
        },
        //切换模块
        changeModule(_id){
            if(_id){
                this.loadResList();
            }
            this.checkList = [];
            this.moudleList.forEach(item=>{
                if(item.id == _id){
                    this.currentModuleName = item.name;
                }
            })
        },
        //加载模块所属资源
        loadResList(){
            this.resLoading = true;
            this.$ajax.get(dataUrl.getResourceListUrl,{
                params:{
                    resourceName:this.searchName,
                    resourceType:this.baseInfoForm.moduleID
                }
            }).then((res) => {
                let data = this.$ajaxCheck(res)
                this.resLoading = false;
                if (!data) return
                if(data.dataList instanceof Array && data.dataList.length){
                    this.allNoCheckList = data.dataList;
                    this.allNoCheckList.forEach(item=>{
                        if(item.resourceFormat == "0"){
                            this.$set(item,'isPic',true);
                            this.$set(item,'isVideo',false);
                            this.$set(item,'noVideo','--');
                        }else if(item.resourceFormat == "1"){
                            this.$set(item,'isVideo',true);
                            this.$set(item,'isPic',false);
                            this.$set(item,'noPic','--');
                        }
                    })
                }else{
                    this.allNoCheckList = [];
                }
            }).catch(err => {
                this.$ajaxError(err)
            }).finally(ok => {
                this.resLoading = false;
            })
        },
        //实时搜索资源
        searchResEvent(){
            this.loadResList();
        },
        /**
         * 左侧表格选择事件
         * @param {object} _val 该行表格数据
         */
        handleSelect(_val){
            this.noCheckList.forEach((item,index)=>{
                if(item.id == _val.id){
                    this.noCheckList.splice(index,1);
                    this.checkList.push(item);
                }
            })
        },
        /**
         * 右侧表格取消事件
         * @param {object} _val 该行表格数据
         */
        handleCancel(_val){
            this.checkList.forEach((item,index)=>{
                if(item.id == _val.id){
                    this.checkList.splice(index,1);
                    this.noCheckList.push(item);
                }
            })
        },
        //清空事件
        clearAllEvent(){
            this.checkList = [];
            this.loadResList();
        },
        //保存前验证
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.checkList.length){
                        this.submitSave();
                    }else{
                        this.$message.error('请选择资源');
                    }
                }
            });
        },
        //提交保存
        submitSave(){
            this.checkList.forEach(item=>{
                this.checkListIds.push(item.id);
            })
            var subData = {
                id:'',
                name: '',
                moduleID: '',
                type:"2",
                knowledgePoint:{
                    question:"",
                    answer:"",
                    direction:"",
                    top:"",
                    description:"",
                    relate:"",
                    resourceIDList:[]
                },
            };
            subData.id = this.baseInfoForm.id;
            subData.name = this.baseInfoForm.name;
            subData.moduleID = this.baseInfoForm.moduleID;
            subData.type = '2',
            subData.knowledgePoint.question = this.baseInfoForm.question;
            subData.knowledgePoint.answer = this.baseInfoForm.answer;
            subData.knowledgePoint.direction = this.baseInfoForm.direction;
            subData.knowledgePoint.top = this.baseInfoForm.top=='是'?'1':'2';
            subData.knowledgePoint.description = this.baseInfoForm.description;
            subData.knowledgePoint.relate = this.baseInfoForm.relate=='是'?'1':'2';
            subData.knowledgePoint.resourceIDList = this.checkListIds;
            this.submitLoading = true;
            this.$ajax.get(dataUrl.addOrUpdateUrl, {
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
    // height:272px;
    background:#fff;
    float: left;
    .baseBorder;
    padding: 16px;
    .baseInfoTit{
        font-size: 16px;
        font-weight: bold;
    }
    .baseInfoForm{
        padding-top: 16px;
        .el-form-item{
            width:320px;
            float: left;
        }
    }

}
.selectRes{
    width:100%;
    height:546px;
    float: left;
    background-color: #fff;
    .baseBorder;
    padding: 24px;
    margin-top:16px;
    .selectResTit{
        font-size: 16px;
        font-weight: bold;
        span{
            color: red;
        }
    }
    .resArea{
        margin-top: 24px;
        width:100%;
        height:546px;
        clear: both;
        .noCheckList{
            width:630px;
            float:left;
            height:451px;
            .noCheckListTit{
                font-size: 14px;
                font-weight: bold;
                padding: 16px;
                position: relative;
                .baseBorder;
                .moduleName{
                    width:325px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .searchRes{
                    position: absolute;
                    right:16px;
                    width:200px;
                    padding: 0 !important;
                    top:10px;

                }
            }
            .tableArea{
                height:399px;
            }
        }
        .checkList{
            width: calc(~'100% - '650px);
            height:451px;
            float:left;
            margin-left:20px;
            .checkListTit{
                font-size: 14px;
                font-weight: bold;
                padding: 16px;
                position: relative;
                .baseBorder;
                .clearAll{
                    position: absolute;
                    right: 16px;
                    top: 10px;
                    .el-button{
                        width:80px;
                    }
                }
            }
        }
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
<style lang="less">
    .tableAreaLeft{
        .el-table__empty-text{
            color: red !important;
        }
    }
</style>
