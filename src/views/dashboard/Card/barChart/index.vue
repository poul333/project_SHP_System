<template>
    <div class="charts" ref="charts">

    </div>
</template>

<script>
import echarts from "echarts"
export default {
    name: 'lineChart',
    mounted() {
        // 初始化echarts实例
        let lineChart = echarts.init(this.$refs.charts)
        //  配置数据
        lineChart.setOption({
            xAxis: {
                show: false,     // 隐藏
                type: 'category',

            },
            yAxis: {
                show: false,
            },
            // 系列
            series: [
                {
                    type: 'bar',
                    data: [28, 18, 33, 20, 57, 33, 87, 56],
                    color:'skyblue'
                }
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            },
            tooltip:{}
        })
    },
}
</script>


<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>