<template>
    <div>
        <el-card style="margin: 20px 0;">
            <!-- 使用全局组件：三级联动 -->
            <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="scene == 0">
                <!-- 展示Spu列表的结构 -->
                <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" :disabled="!category3Id"
                    @click="addSpu">添加Spu</el-button>
                <el-table style="width: 100%" border :data="records">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="spuName" label="Spu名称" width="width"></el-table-column>
                    <el-table-column prop="description" label="Spu描述" width="width"></el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,index}">
                            <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku"
                                @click="addSku(row)">
                            </hint-button>
                            <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"
                                @click="updateSpu(row)">
                            </hint-button>
                            <hint-button type="info" icon="el-icon-info" size="mini" title="查看spu下的全部sku列表">
                            </hint-button>
                            <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini"
                                    title="删除"></hint-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination style="margin-top: 15px; text-align: center" :total="total" :current-page="page"
                    :page-size="limit" :page-sizes="[3, 5, 10]" @current-change="getSpuList"
                    @size-change="handlerSizeChange" layout="prev,pager,next,jumper,->,sizes,total">
                </el-pagination>
            </div>
            <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
            <SkuForm v-show="scene == 2" @changeScenes="changeScenes" ref="sku"></SkuForm>
        </el-card>
    </div>

</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
    name: 'Spu',
    data() {
        return {
            // 一到三级分类相应id
            category1Id: "",
            category2Id: "",
            category3Id: "",
            // 三级联动下拉框是否禁用
            page: 1,    // 当前页
            limit: 3,    // 每页展示数据
            records: [],     // Spu列表数据
            total: 0,    // 数据总数
            scene: 0,    // 0--展示Spu列表数据     1--展示添加|修改Spu       2--添加Sku 
        }
    },
    components: {
        SpuForm,
        SkuForm
    },
    methods: {
        // 获取Spu列表数据的方法
        async getSpuList(pages = 1) {
            this.page = pages   // 获取最新当前页
            // 解构出需要携带的参数
            const { page, limit, category3Id } = this
            // 发起请求
            let result = await this.$API.spu.rqeSpuList(page, limit, category3Id)
            if (result.code == 200) {
                this.total = result.data.total
                this.records = result.data.records
            }
        },
        // 自定义事件回调 ---- 父子间传递分类id
        getCategoryId({ categoryId, level }) {
            // 区分三级分类相应的id,父组件进行存储
            if (level == 1) {
                this.category1Id = categoryId
                //对下级id进行置空
                this.category2Id = ''
                this.category3Id = ''
            } else if (level == 2) {
                this.category2Id = categoryId
                // 置空下级id
                this.category3Id = ''
            } else {
                this.category3Id = categoryId
                // 发请求获取列表数据
                this.getSpuList()
            }
        },
        // 点击分页器页码的回调
        // #region
        // handlerCurrentChange(page){
        //     this.page = page    // 获取新的当前页
        //     this.getSpuList()   // 重新获取列表
        // }
        // #endregion
        // 设置每页展示多少条数据
        handlerSizeChange(limit) {
            this.limit = limit      // 收集数据
            this.getSpuList()       // 获取列表数据
        },
        // 点击添加Spu按钮回调
        addSpu() {
            this.scene = 1      // 切换展示SpuForm组件
            // 通知子组件SpuForm发送请求获取 品牌和销售属性
            this.$refs.spu.addSpuData(this.category3Id)
        },
        // 点击修改Spu按钮回调
        updateSpu(row) {
            this.scene = 1      // 切换展示SpuForm组件
            // 获取子组件SpuForm
            this.$refs.spu.initSpuData(row)
        },
        // SpuForm组件传递scene的自定义事件回调
        changeScene({ scene, flag }) {
            this.scene = scene      // 展示切换为Spu列表
            // 切换场景后重新获取列表数据，如果为修改，完成后停留在修改数据的页数，如果为条件，完成后回到第一页
            if (flag === "修改") {
                this.getSpuList(this.page)
            } else {
                this.getSpuList()
            }

        },
        // 删除Spu
        async deleteSpu(row) {
            // 删除请求
            await this.$API.spu.reqDeleteSpu(row.id)
            try {
                // 删除成功
                this.$message({ type: 'success', message: '删除成功' })
                // 重新获取列表，成功后判断停留页面
                this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
            } catch (error) {
                console.log(error.message);
            }
        },
        // 点击添加Sku按钮回调
        addSku(row) {
            this.scene = 2      // 切换展示SkuForm组件
            this.$refs.sku.getData(this.category1Id, this.category2Id, row)
        },
        // skuForm组件传递scene的自定义事件
        changeScenes(scene) {
            this.scene = scene  // 进行场景切换
        }
    },
}
</script>

<style scoped>

</style>