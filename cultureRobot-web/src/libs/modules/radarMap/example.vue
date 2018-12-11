<!--
    by: tengma 2018年08月23日
    name: 雷达图例子
-->
<template lang="html">
    <div class="frame">
        <div class="frame1">
            <radarMap :mapData="mapData" style="width:100%; height:400px"></radarMap>
            <div class="buttonFroup">
                <el-button type="primary" @click="changeData">切换数据</el-button>
            </div>
        </div>
        <div class="frame2">
            <radarMapForMean :mapData="mapDataMean" style="width:100%; height:400px"></radarMapForMean>
            <div class="buttonFroup">
                <el-button type="primary" @click="changeDataMean">切换数据</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import radarMapForMean from "./radarMapForMean.vue";
import radarMap from "./radarMap.vue";
export default {
    data() {
        return {
            mapData: [],
            mapDataMean: [],
        }
    },
    components: {
        radarMap: radarMap,
        radarMapForMean:radarMapForMean
    },
    mounted() {
        this.changeData();
        this.changeDataMean();
    },
    methods: {
        random(lowerValue, upperValue) {
            return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
        },
        changeDataMean() {
            this.mapDataMean = [{
                    title: "认知能力1",
                    value: this.random(40, 90),
                    mean: this.random(40, 90)
                },
                {
                    title: "思维能力1",
                    value: this.random(40, 90),
                    mean: this.random(40, 90)
                },
                {
                    title: "调控能力1",
                    value: this.random(40, 90),
                    mean: this.random(40, 90)
                },
                {
                    title: "发展规划能力1",
                    value: this.random(40, 90),
                    mean: this.random(40, 90)
                },
                {
                    title: "社交能力1",
                    value: this.random(40, 90),
                    mean: this.random(40, 90)
                },
                {
                    title: "协作能力1",
                    value: this.random(40, 90),
                    mean: this.random(40, 90)
                },
                {
                    title: "实践能力1",
                    value: this.random(40, 90),
                    mean: this.random(40, 90)
                },
                {
                    title: "数字化能力1",
                    value: this.random(40, 90),
                    mean: this.random(40, 90)
                }
            ];
        },
        changeData() {
            this.mapData = [{
                    title: "认知能力",
                    value: this.random(40, 90)
                },
                {
                    title: "思维能力",
                    value: this.random(40, 90)
                },
                {
                    title: "调控能力",
                    value: this.random(40, 90)
                },
                {
                    title: "发展规划能力",
                    value: this.random(40, 90)
                },
                {
                    title: "社交能力",
                    value: this.random(40, 90)
                },
                {
                    title: "协作能力",
                    value: this.random(40, 90)
                },
                {
                    title: "实践能力",
                    value: this.random(40, 90)
                }
            ];
        }
    }
}
</script>

<style lang="less" scoped>
.frame {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.buttonFroup {
    text-align: center;
}
.frame1 {
    position: fixed;
    width: 50%;
    height: 100%;
    top: 0;
    left: 0;
}
.frame2 {
    position: fixed;
    width: 50%;
    height: 100%;
    top: 0;
    right: 0;
}
</style>
