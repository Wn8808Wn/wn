<!--
    by: yingdong 2018年08月27日
    name: 入口路由
    notes: 登陆后根据路由进行分发
-->
<template lang="html">
    <div v-loading.fullscreen="loading">
        <router-view></router-view>
    </div>
</template>

<script>
import dataUrl from '@/libs/interface/public.js'
export default {
    data() {
        return {
            loading: false
        }
    },
    props: {
        firstRouter: {
            type: Object
        }
    },
    mounted() {
        if (this.firstRouter.path !== "/" && this.firstRouter.path !== "/index.html") {
            this.$router.replace(Object.assign({}, this.firstRouter));
        }else{
            this.$router.replace({
                name: "/login.html"
            });
        }
    },
    methods:{}
}
</script>
