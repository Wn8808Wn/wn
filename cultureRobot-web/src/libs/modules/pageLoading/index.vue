<template>
    <div class="wrap">
        <div class="loadingImg">
            <img src="@image/public/loading.gif" alt="">
        </div>
    </div>
</template>

<script>
export default {
    name: "pageLoading"
}
</script>

<style lang="less" scoped>
    .wrap {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 10000000;
        .loadingImg {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            width: 172px;
            height: 105px;
            transform: scale(0.58);
        }
    }
</style>


