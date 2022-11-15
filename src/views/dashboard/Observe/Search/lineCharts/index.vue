<template>
    <div>
        <div class="header">
            <span style="margin-right: 10px;">搜索用户数</span>
            <span>
                <svg t="1668430177650" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="2799" width="16" height="16">
                    <path
                        d="M169.984 169.984C-19.456 358.4-19.456 665.6 169.984 854.016s495.616 189.44 684.032 0 189.44-495.616 0-684.032-495.616-189.44-684.032 0z m606.208 606.208c-146.432 146.432-384 146.432-530.432 0S99.328 392.192 245.76 245.76s384-146.432 530.432 0c147.456 147.456 147.456 385.024 0 530.432zM456.704 306.176c0-40.96 33.792-73.728 74.752-73.728S605.184 266.24 604.16 307.2c0 40.96-33.792 74.752-73.728 73.728-40.96-1.024-74.752-34.816-73.728-74.752z m179.2 423.936c-2.048 6.144-6.144 13.312-10.24 17.408-26.624 27.648-59.392 43.008-97.28 44.032-18.432 0-35.84 0-54.272-3.072-29.696-4.096-67.584-40.96-61.44-79.872l12.288-79.872 24.576-138.24c0-3.072 1.024-6.144 1.024-9.216 0-19.456-6.144-26.624-25.6-28.672-8.192-1.024-16.384-2.048-24.576-4.096-9.216-3.072-13.312-11.264-13.312-18.432 1.024-8.192 6.144-13.312 16.384-15.36 5.12-1.024 11.264-1.024 16.384-1.024h139.264c17.408 0 27.648 8.192 27.648 25.6 0 14.336-2.048 28.672-5.12 43.008-9.216 53.248-19.456 105.472-28.672 158.72-3.072 17.408-7.168 34.816-9.216 52.224-1.024 8.192 0 17.408 2.048 25.6 3.072 11.264 11.264 17.408 22.528 15.36 9.216-1.024 18.432-4.096 27.648-8.192 7.168-3.072 13.312-8.192 20.48-10.24 13.312-5.12 22.528 3.072 19.456 14.336z"
                        fill="#BABABA" p-id="2800"></path>
                </svg>
            </span>
        </div>
        <div class="main">
            <span class="main-title">12342</span>
            <span class="main-context">17.1</span>
            <svg t="1668431612686" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="3818" width="16" height="16">
                <path
                    d="M752.64 376.32 546.56 202.88c-19.2-16-50.56-16-69.76 0L270.72 376.32C240 402.56 261.76 447.36 305.28 447.36L384 447.36C384 447.36 384 448 384 448l0 320c0 35.2 28.8 64 64 64l128 0c35.2 0 64-28.8 64-64L640 448c0 0 0-0.64 0-0.64l78.08 0C761.6 447.36 783.36 402.56 752.64 376.32z"
                    p-id="3819" fill="#1afa29"></path>
            </svg>
            <svg t=" 1668431752552" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="4951" width="16" height="16">
                <path
                    d="M258.048 568.832l253.952 279.04 253.952-279.04c22.016-24.064 13.312-43.52-18.944-43.52H629.76v-322.56c0-32.768-26.112-58.88-58.88-58.88h-117.76c-32.256 0-58.368 26.112-58.88 58.368v323.072H276.992c-31.744 0-40.448 19.456-18.944 43.52z"
                    fill="#d81e06" p-id="4952"></path>
            </svg>
        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
        </div>
    </div>
</template>


<script>
import echarts from "echarts"
export default {
    name: 'lineCharts',
    mounted() {
        // 初始化echarts实例
        let lineChart = echarts.init(this.$refs.charts)
        //  配置数据
        lineChart.setOption({
            xAxis: {
                show: false,     // 隐藏
                type: 'category'
            },
            yAxis: {
                show: false,
            },
            // 系列
            series: [
                {
                    type: 'line',
                    data: [28, 18, 33, 20, 57, 33],
                    smooth: true,

                    // 拐点样式设置
                    itemStyle: {
                        opacity: 0
                    },
                    // 线条样式
                    lineStyle: {
                        color: 'blue',
                    },
                    // 填充颜色
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'skyblue' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                        },
                        opacity: 0.5
                    }
                }
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }
        })
    },
}
</script>


<style scoped>
.header {
    display: flex;
    align-items: center;
}

.main {
    margin: 10px 0;
}

.main-title {
    margin-right: 20px;
}

.main-context {
    margin-right: 10px;
}

.charts {
    width: 100%;
    height: 50px;
}
</style>