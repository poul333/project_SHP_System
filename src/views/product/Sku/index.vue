<template>
    <div>
        <el-table style="width: 100%" border :data="records">
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
            <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
            <el-table-column label="默认图片" width="130" align="center">
                <template slot-scope="{row,$index}">
                    <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量(KG)" width="100" align="center"></el-table-column>
            <el-table-column prop="price" label="价格(元)" width="100" align="center"></el-table-column>
            <el-table-column prop="prop" label="操作" width="width" align="center">
                <template slot-scope="{row,$index}">
                    <el-button type="info" icon="el-icon-bottom" size="mini" v-if="row.isSale == 0"
                        @click="onSale(row)"></el-button>
                    <el-button type="success" icon="el-icon-top" size="mini" v-else @click="cancelSale(row)">
                    </el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editing"></el-button>
                    <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination @size-change="handleSizeChange" @current-change="getSkuList" :current-page="page"
            :page-size="limit" :page-sizes="[3, 5, 10]" layout=" prev, pager, next,jumper,->,sizes,total" :total="total"
            style="text-align: center;">
        </el-pagination>
        <!-- sku详情抽屉效果 -->
        <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
            <el-row>
                <el-col :span="5">名称</el-col>
                <el-col :span="16">{{ skuInfo.skuName }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">描述</el-col>
                <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">价格</el-col>
                <el-col :span="16">{{ skuInfo.price }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">平台属性</el-col>
                <el-col :span="16">
                    <template>
                        <el-tag type="success" v-for="(attr, index) in skuInfo.skuAttrValueList" :key="attr.id"
                            style="margin: 5px;">
                            {{ attr.attrId }}--{{ attr.valueId }}</el-tag>
                    </template>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">商品图片</el-col>
                <el-col :span="16">
                    <el-carousel height="400px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                            <img :src="item.imgUrl">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>


<script>
export default {
    name: 'Sku',
    data() {
        return {
            page: 1,    // 当前页
            limit: 10,    // 每页展示条数
            records: [],     // 存储sku列表数据
            total: 0,        // 总条数
            skuInfo: {},     // 存储sku详情数据
            drawer: false,   // 控制抽屉效果
        }
    },
    mounted() {
        this.getSkuList()
    },
    methods: {
        // 获取sku列表数据
        async getSkuList(pages = 1) {
            this.page = pages
            const { page, limit } = this
            let result = await this.$API.sku.reqSkuList(page, limit)
            // 收集数据
            if (result.code == 200) {
                this.records = result.data.records
                this.total = result.data.total
            }
        },
        // 切换每页展示条数回调
        handleSizeChange(limit) {
            this.limit = limit
            this.getSkuList()
        },
        // sku商品上架
        async onSale(row) {
            let result = await this.$API.sku.reqOnSale(row.id)
            if (result.code == 200) {
                this.$message({ type: 'success', message: '上架成功' })
                row.isSale = 1  // 修改商品状态
            }
        },
        // sku商品下架
        async cancelSale(row) {
            let result = await this.$API.sku.reqCancelSale(row.id)
            if (result.code == 200) {
                this.$message({ type: 'success', message: '下架成功' })
                row.isSale = 0     // 修改状态
            }
        },
        // 编辑按钮回调
        editing() {
            this.$message('正在开发中')
        },
        // 获取sku详情回调
        async getSkuInfo(sku) {
            // 获取数据
            let result = await this.$API.sku.reqSkuById(sku.id)
            if (result.code == 200) {
                this.skuInfo = result.data
            }
            // 展示抽屉
            this.drawer = true
        }
    },
}
</script>

<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>

<style scoped>
.el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
}

.el-col {
    margin: 10px;
}

img {
    width: 100%;
    height: 100%;
    /*元素的位置相对于浏览器窗口是固定位置*/
    position: fixed;
    left: 0;
    top: 0;
}
</style>