<template>
    <el-card class="box-card" style="margin: 10px 0;">
        <!-- 头部 -->
        <div slot="header" class="clearfix">
            <!-- v-model="activeName" @tab-click="handleClick" -->
            <!-- 左侧 -->
            <el-tabs class="tab" v-model="activeName">
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visite"></el-tab-pane>
            </el-tabs>
            <!-- 右侧 -->
            <div class="right">
                <span @click="setDay">今日</span>
                <span @click="setWeek">本周</span>
                <span @click="setMonth">本月</span>
                <span @click="setYear">本年</span>
                <!-- v-model="value1" -->
                <el-date-picker v-model="date" class="date" type="daterange" range-separator="-"
                    start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </div>
        <!-- context -->
        <div>
            <el-row :gutter="10">
                <el-col :span="16">
                    <!-- 柱状图 -->
                    <div class="charts" ref="charts">

                    </div>
                </el-col>
                <el-col :span="8" class="right">
                    <h4>门面{{ title }}排名</h4>
                    <ul>
                        <li>
                            <span class="rindex">1</span>
                            <span>肯德基</span>
                            <span class="rvalue">13234 </span>
                        </li>
                        <li>
                            <span class="rindex">2</span>
                            <span>肯德基</span>
                            <span class="rvalue">13234 </span>
                        </li>
                        <li>
                            <span class="rindex">3</span>
                            <span>肯德基</span>
                            <span class="rvalue">13234 </span>
                        </li>
                        <li>
                            <span>4</span>
                            <span>肯德基</span>
                            <span class="rvalue">13234 </span>
                        </li>
                        <li>
                            <span>5</span>
                            <span>肯德基</span>
                            <span class="rvalue">13234 </span>
                        </li>
                        <li>
                            <span>6</span>
                            <span>肯德基</span>
                            <span class="rvalue">13234 </span>
                        </li>
                        <li>
                            <span>7</span>
                            <span>肯德基</span>
                            <span class="rvalue">13234 </span>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>


<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
    name: 'Sale',
    data() {
        return {
            activeName: 'sale',
            mycharts: null,
            date: [],    // 收集时间
        }
    },
    computed: {
        title() {
            return this.activeName == 'sale' ? '销售额趋势' : '访问量趋势'
        },
        ...mapState({
            listState: state => state.home.list
        })
    },
    mounted() {
        // 初始echarts实例
        this.mycharts = echarts.init(this.$refs.charts)
        this.mycharts.setOption({
            title: {
                text: '销售额趋势'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.listState.orderFullYearAxis,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    color: 'skyblue',
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.listState.orderFullYear,
                }
            ]
        })
    },
    watch: {
        title() {
            this.mycharts.setOption({
                title: {
                    text: this.title
                },
                xAxis: {
                    data: this.title == '销售额趋势' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis
                },
                series: [
                    {
                        color: 'skyblue',
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.title == '销售额趋势' ? this.listState.orderFullYear : this.listState.userFullYear
                    }
                ]
            })
        },
        listState() {
            this.mycharts.setOption({
                title: {
                    text: '销售额趋势'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.listState.orderFullYearAxis,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        color: 'skyblue',
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.listState.orderFullYear,
                    }
                ]
            })
        }
    },
    methods: {
        setDay() {
            const day = dayjs().format('YYYY-MM-DD')
            this.date = [day, day]
        },
        setWeek() {
            const start = dayjs().day(1).format('YYYY-MM-DD')
            const end = dayjs().day(7).format('YYYY-MM-DD')
            this.date = [start, end]
        },
        setMonth() {
            const start = dayjs().startOf('month').format('YYYY-MM-DD')
            const end = dayjs().endOf('month').format('YYYY-MM-DD')
            this.date = [start, end]
        },
        setYear() {
            const start = dayjs().startOf('year').format('YYYY-MM-DD')
            const end = dayjs().endOf('year').format('YYYY-MM-DD')
            this.date = [start, end]
        }
    },
}
</script>


<style scoped>
.clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
}

.tab {
    width: 100%;
}

.right {
    position: absolute;
    right: 0;
}

.date {
    width: 250px;
    margin: 0 20px;
}

.right span {
    margin: 0 20px;
    font-size: 14px;
}

.charts {
    width: 100%;
    height: 300px;
}

ul {
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0;
}

ul li {
    height: 8%;
    margin: 10px 0;
}

.rindex {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #000;
    color: #fff;
    text-align: center;
}

.rvalue {
    float: right;
}
</style>