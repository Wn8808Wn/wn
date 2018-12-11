<!--
    by: tengma 2018年08月23日
    name: 雷达图
-->
<template lang="html">
    <div>
        <svg>
            <defs>
                <linearGradient x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="#32a5ff" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#3b7bd8" stop-opacity="0.5"/>
                </linearGradient>
                <filter x="0" y="0" width="150%" height="150%">
                    <feOffset result="offOut" in="SourceGraphic" dx="2" dy="6" />
                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="6" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                </filter>
            </defs>
        </svg>
    </div>
</template>

<script>
const d3 = require("D3");
//const color = require("./color.js");
class RadarMapDom {
    constructor() {
        this.scoped = [];
        this.svg = null;
        this.bgC = null;
        this.bgC1 = null;
        this.bgC2 = null;
        this.dataGroup = null;
        this.centerCircle = null;
        this.lineArr = [];
        this.circleArr = [];
        this.dataSvgArr = [];
        this.path = null;
    }
    destroy() {
        this.scoped = this.svg = this.bgC = this.bgC1 = this.bgC2 = this.dataGroup = this.centerCircle = this.lineArr = this.circleArr = this.dataSvgArr = null;
    }
}

function random(lowerValue, upperValue) {
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

function autoPushDel(length, callback) {
    if (!(this instanceof Array)) return this;
    if (this.length < length) {
        for (var i = this.length; i < length; i++) {
            this.push(callback.call(this, true, null, i));
        }
    } else if (this.length > length) {
        for (var i = this.length; i > 0 && i > length; i--) {
            callback.call(this, false, this[i - 1], i - 1);
            this.splice(i - 1, 1);
        }
    }
}

export default {
    data() {
        return {
            dom: new RadarMapDom()
        }
    },
    props: {
        themeColor: {
            type: String,
            default: "#1c71ff"
        },
        mapData: {
            type: Array,
            default () {
                return [
                    // {
                    //     title: "认知能力",
                    //     value: random(40, 90),
                    // },
                    // {
                    //     title: "思维能力",
                    //     value: random(40, 90),
                    // },
                    // {
                    //     title: "调控能力",
                    //     value: random(40, 90),
                    // },
                    // {
                    //     title: "发展规划能力",
                    //     value: random(40, 90),
                    // },
                    // {
                    //     title: "社交能力",
                    //     value: random(40, 90),
                    // },
                    // {
                    //     title: "协作能力",
                    //     value: random(40, 90),
                    // },
                    // {
                    //     title: "实践能力",
                    //     value: random(40, 90),
                    // },
                    // {
                    //     title: "数字化能力",
                    //     value: random(40, 90),
                    // }
                ]
            }
        }
    },
    watch: {
        mapData(newValue, oldValue) {
            this.update();
        }
    },
    mounted() {
        var attributes = this.$el.attributes;

        for (var name in attributes) {
            var obj = attributes[name];
            if (typeof obj === "object") {
                if (String(attributes[name].name).substr(0, 7) == "data-v-") {
                    this.dom.scoped.push(String(attributes[name].name));
                }
            }
        }
        var linearGradientId="linearGradient"+Math.random();
        var filterId="filter"+Math.random();
        this.$el.querySelector("linearGradient").setAttribute("id",linearGradientId);
        this.$el.querySelector("filter").setAttribute("id",filterId);
        this.dom.svg = d3.select(this.$el.querySelector("svg")).attr("width", "100%").attr("height", "100%");
        this.dom.bgC = this.dom.svg.append("svg").attr("opacity", 0.1);
        this.dom.bgC1 = this.dom.bgC.append("circle")
            .attr("fill", "none")
            .attr("stroke", this.themeColor)
            .attr("stroke-width", 1);
        this.dom.bgC2 = this.dom.bgC.append("circle")
            .attr("fill", "none")
            .attr("stroke", this.themeColor)
            .attr("stroke-width", 3);
        this.dom.centerCircle = this.dom.bgC.append("circle")
            .attr("fill", this.themeColor);
        this.dom.path = this.dom.svg.append("path").attr("fill", `url(#${linearGradientId})`).attr("filter",`url(#${filterId})`);//.attr("opacity", 0.5);//.attr("stroke", this.themeColor);
        this.dom.dataGroup = this.dom.svg.append("g");
        this.update();
    },
    methods: {
        deepAttr() {
            var allSelector = this.$el.querySelectorAll("g>*");
            for (var i = 0; i < allSelector.length; i++) {
                this.dom.scoped.forEach(attr => {
                    allSelector[i].setAttribute(attr, "");
                })
            }
        },
        update() {
            var bgC = this.dom.bgC,
                bgC1 = this.dom.bgC1,
                bgC2 = this.dom.bgC2,
                centerCircle = this.dom.centerCircle,
                lineArr = this.dom.lineArr,
                circleArr = this.dom.circleArr,
                dataSvgArr = this.dom.dataSvgArr,
                dataGroup = this.dom.dataGroup;
            //基本参数------------------------------------------------------------>
            var width = this.$el.offsetWidth, //宽度
                height = this.$el.offsetHeight, //高度
                margin = 5,
                centerPoint = {
                    x: width / 2,
                    y: height / 2
                }, //圆心
                radius = Math.min(width, height) / 2 - 60, //半径
                cont = this.mapData.length,
                angle = 360 / cont;
            //准备背景元素------------------------------------------------------------>
            bgC.attr("x", centerPoint.x - radius - margin).attr("y", centerPoint.y - radius - margin).attr("width", radius * 2 + margin * 2).attr("height", radius * 2 + margin * 2);
            bgC1.attr("cx", radius + margin).attr("cy", radius + margin).attr("r", radius);
            bgC2.attr("cx", radius + margin).attr("cy", radius + margin).attr("r", radius - 10);
            centerCircle.attr("cx", radius + margin).attr("cy", radius + margin).attr("r", 6);
            //配置背景各个线
            autoPushDel.bind(lineArr)(cont, (type, obj) => {
                if (type) {
                    return bgC.append("line")
                        .attr("x2", radius + margin)
                        .attr("y2", radius + margin)
                        .attr("stroke-width", 1)
                        .attr("stroke", this.themeColor);
                } else {
                    obj.remove();
                }
            });
            //配置背景各个圆点
            autoPushDel.bind(circleArr)(cont, (type, obj) => {
                if (type) {
                    return bgC.append("circle").attr("r", 4).attr("fill", this.themeColor);
                } else {
                    obj.remove();
                }
            });
            //定位各角度点及背景线
            circleArr.forEach((item, i) => {
                var eleX = radius + margin + Math.cos((angle * i - 90) * Math.PI / 180) * radius;
                var eleY = radius + margin + Math.sin((angle * i - 90) * Math.PI / 180) * radius;
                item.attr("cx", eleX).attr("cy", eleY);
                lineArr[i].attr("x1", eleX).attr("y1", eleY);
            })
            //绘制界面元素------------------------------------------------------------>
            //计算
            var maxData = -Infinity, //最大
                minData = Infinity; //最小
            this.mapData.forEach((item, index) => {
                maxData = Math.max(maxData, item.value);
                minData = Math.min(minData, item.value);
            })
            maxData = maxData + maxData * 0.1;
            minData = minData - minData * 0.4;

            //增删补充数据
            autoPushDel.bind(dataSvgArr)(cont, (type, obj, index) => {
                if (type) {
                    return {
                        text: dataGroup.append("text"),
                        circle: dataGroup.append("circle")
                            .attr("r", 4),
                        value: this.mapData[index].value,
                        title: this.mapData[index].title
                    }
                } else {
                    obj.line.remove();
                    obj.text.remove();
                    obj = null;
                }
            })
            let pointStr = []; //上一条线

            dataSvgArr.forEach((child, childIndex) => {
                child.title = this.mapData[childIndex].title;
                child.value = this.mapData[childIndex].value;
                let layer = child;
                let itemRadius = (child.value - minData) / (maxData - minData) * radius; //半径
                let eleX = centerPoint.x + Math.cos((angle * childIndex - 90) * Math.PI / 180) * itemRadius;
                let eleY = centerPoint.y + Math.sin((angle * childIndex - 90) * Math.PI / 180) * itemRadius;
                layer.circle.attr("cx", eleX)
                    .attr("cy", eleY)
                    .attr("fill", this.themeColor);
                // (agoLine ? agoLine : dataSvgArr[dataSvgArr.length - 1].line).attr("x2", eleX).attr("y2", eleY);
                // layer.line.attr("x1", eleX).attr("y1", eleY);
                pointStr.push((!childIndex ? "M" : "L") + Math.floor(eleX) + " " + Math.floor(eleY));
                var newAngle = angle * childIndex - 90;

                eleX = centerPoint.x + Math.cos(newAngle * Math.PI / 180) * (radius + 15);
                eleY = centerPoint.y + Math.sin(newAngle * Math.PI / 180) * (radius + 15);
                layer.text.attr("x", eleX).attr("y", eleY - 10)

                var angleValue = Math.abs(newAngle + 90) % 360;
                if (angleValue == 0 || angleValue == 180) {
                    layer.text.attr("text-anchor", "middle");
                    layer.text.attr("y", angleValue == 180 ? eleY + 18 : eleY - 5);
                } else if (angleValue > 0 && angleValue < 180) {
                    layer.text.attr("text-anchor", "start");
                    layer.text.attr("y", eleY + angleValue / 180 * 18);
                } else if (angleValue > 180 && angleValue < 360) {
                    layer.text.attr("text-anchor", "end");
                    layer.text.attr("y", eleY + (180 - angleValue % 180) / 180 * 18);
                }
                layer.text.text(child.title);
                //layer.text.html(`<tspan fill="#606265">${child.title}</tspan> <tspan>${layer.value}</tspan>`);
            });
            this.dom.path.attr("d", pointStr.join(" ") + " Z");
            this.deepAttr();
        },
        beforeDestroy() {
            this.dom.destroy();
        }
    }
}
</script>
<style lang="less" scoped>
circle,
line,
text {
    transition: all cubic-bezier(0.03, 1.04, 0.95, 0.99) 200ms;
}
</style>
