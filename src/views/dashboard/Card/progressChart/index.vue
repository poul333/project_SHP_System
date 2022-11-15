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
                min: 0,
                max: 100,

            },
            yAxis: {
                show: false,
                type: 'category',   // 均分
            },
            // 系列
            series: [
                {
                    type: 'bar',
                    data: [78],
                    color: '#bfa',
                    barWidth: 10,
                    showBackground: true,
                    // 背景颜色
                    backgroundStyle: {
                        color: '#eee'
                    },
                    // 表格内文本   
                    label: {
                        show: true,
                        formatter: '|',
                        position: 'right',
                        color: '#999'
                    }
                }
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            },
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