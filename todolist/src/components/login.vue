<template>
    <div id="login">
        <h1 @click = 'login'>toDoList</h1>
    </div>
</template>


<script>
export default {
    methods:{
        login(){
            this.$router.push({name:'home'})
        }

    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

$color:red;
#login{
    &>h1{
        color:$color;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;


    }
}



</style>
