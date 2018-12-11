<template>
    <div v-show="showBackTopIcon" class="wrap" @click="backToTop"></div>
</template>

<script>
export default {
    name: "backToTop",
    data() {
        return {
            showBackTopIcon: false
        }
    },
    methods: {
        onScroll() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            let viewHeight = document.documentElement.clientHeight || document.body.clientHeight;
            
            if (scrollTop >= 1400 - viewHeight) {
                this.showBackTopIcon = true;
            } else {
                this.showBackTopIcon = false;
            }
        },
        backToTop() {
            var gotoTop= function(){
                var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
                    currentPosition -= 20;
                if (currentPosition > 0) {
                    window.scrollTo(0, currentPosition);
                }
                else {
                    window.scrollTo(0, 0);
                    clearInterval(timer);
                    timer = null;
                }
            }
            var timer=setInterval(gotoTop,1);
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("scroll", this.onScroll);
        });
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.onScroll);
    }
}
</script>

<style lang="less" scoped>
    @import "~@/libs/css/theme/theme.less";
    .wrap {
        position: fixed;
        width: 60px;
        height: 60px;
        right: 30px;
        bottom: 55px;
        cursor: pointer;
        background: url("~@image/public/backToTop.png") no-repeat 50% / contain;
        &:hover {
            background: url("~@image/public/backToTopActive.png") no-repeat 50% / contain;
        }
        z-index: 10000;
    }
</style>

