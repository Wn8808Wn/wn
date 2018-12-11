<template>
    <div class="top">
        <ul>
           <li v-for="(item,index) in navList">
              <router-link :to='{path:item.path}'>{{item.tie}}</router-link> 
            </li>
        </ul>


    </div>
</template>

<script>
export default {
    data(){
        return{
            navList:[ {path:'/person',tie:'个人管理'}, {path:'/xinxi',tie:'信息管理'}, {path:'/caiwu',tie:'财务管理'}]
          
        }
    }


}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
li{
    list-style: none;
}
a{
    text-decoration: none;
}
.top{
    width:100%;
    height: 80px;
    position: absolute;
    left: 0;
    top: 0;
    background: skyblue;
    &>ul{
        width: 120px;
        height: 80px;
        background: red;
        &>li{
            width: 40px;
            height: 100%;
            color:#000;
            text-align: center;
            line-height: 80px;
            float: left;
        }
    }
}


</style>
