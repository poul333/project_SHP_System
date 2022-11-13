<template>
    <div>
        <el-form ref="form" label-width="80px">
            <el-form-item label="Spu名称">
                {{ spu.spuName }}
            </el-form-item>
            <el-form-item label="Sku名称">
                <el-input placeholder="Sku名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
            </el-form-item>
            <el-form-item label="重量(千克)">
                <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input type="textarea" rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="attr.attrName" style="margin: 10px;" v-for="(attr, index) in attrInfoList"
                        :key="attr.id">
                        <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                                v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label=" 销售属性">
                <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr, index) in spuSaleAttrList"
                        :key="saleAttr.id">
                        <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
                            <el-option :label="saleAttrValue.saleAttrValueName"
                                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表">
                <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" prop="prop" width="80"></el-table-column>
                    <el-table-column prop="prop" label="图片" width="width">
                        <template slot-scope="{row,$index}">
                            <img :src="row.imgUrl" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <el-button type="primary" size="mini" v-if="row.isDefault == 0" @click="changeDefault(row)">
                                设置默认</el-button>
                            <el-button size="mini" v-else>默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>
export default {
    name: 'SkuForm',
    data() {
        return {
            spuImageList: [],    // 存储图片数据
            spuSaleAttrList: [],    // 存储销售属性
            attrInfoList: [],        // 存储平台属性
            spu: {},
            // 收集sku数据的字段
            skuInfo: {
                "category3Id": 0,
                "price": '',
                "spuId": 0,
                "tmId": 0,
                "skuName": "",
                "weight": "",
                "skuDesc": "",    // 规格描述
                // 图片数据
                "skuImageList": [
                    // {
                    //     "id": 0,
                    //     "imgName": "string",
                    //     "imgUrl": "string",
                    //     "isDefault": "string",
                    //     "skuId": 0,
                    //     "spuImgId": 0
                    // }
                ],
                // 设置默认图片
                "skuDefaultImg": "",
                // 平台属性
                "skuAttrValueList": [
                    {
                        // "attrId": 0,
                        // "valueId": 0,
                    }
                ],
                // 销售属性
                "skuSaleAttrValueList": [
                    // {
                    //     "id": 0,
                    //     "saleAttrId": 0,
                    //     "saleAttrName": "string",
                    //     "saleAttrValueId": 0,
                    //     "saleAttrValueName": "string",
                    //     "skuId": 0,
                    //     "spuId": 0
                    // }
                ],
            },
            // 收集图片
            imageList: [],
        }
    },
    methods: {
        // 获取SkuForm数据
        async getData(category1Id, category2Id, spu) {
            // 先对父组件给予的数据进行收集
            this.spu = spu
            this.skuInfo.category3Id = spu.category3Id
            this.skuInfo.spuId = spu.id
            this.skuInfo.tmId = spu.tmId
            // 获取图片数据
            let imageResult = await this.$API.spu.rqeSpuImageList(spu.id)
            if (imageResult.code == 200) {
                let list = imageResult.data
                // 给图片数据加上 isDefault 属性,用来控制默认切换
                list.forEach(item => {
                    item.isDefault = 0
                })
                this.spuImageList = list
            }
            // 获取销售数据
            let saleAttrResult = await this.$API.spu.rqeSpuSaleAttrList(spu.id)
            if (saleAttrResult.code == 200) this.spuSaleAttrList = saleAttrResult.data
            // 获取平台属性数据
            let attrInfoResult = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
            if (attrInfoResult.code == 200) this.attrInfoList = attrInfoResult.data
        },
        // 当选择项发生变化时的回调
        handleSelectionChange(params) {
            // 用参数获取用户选中的图片信息,并进行收集
            this.imageList = params
        },
        // 点击设置默认的回调
        changeDefault(row) {
            // 排他
            // 进行默认与否的切换
            this.spuImageList.forEach(item => {
                item.isDefault = 0
            })
            row.isDefault = 1
            // 收集默认图片的地址
            this.skuInfo.skuDefaultImg = row.imgUrl
        },
        //  取消按钮回调
        cancel() {
            // 触发自定义事件通知父组件将场景切换为0
            this.$emit('changeScenes', 0)
            // 置空数据
            Object.assign(this._data, this.$options.data())
        },
        // 保存按钮的回调
        async save() {
            // 整理参数
            // #region
            // // 整理平台属性 方式一
            // let attrArr = []
            // const { attrInfoList, skuInfo } = this
            // attrInfoList.forEach(item => {
            //     // 如果有 attrIdAndValueId 代表为用户进行选择的图片
            //     if (item.attrIdAndValueId) {
            //         // 进行字符切割
            //         const [attrId, valueId] = item.attrIdAndValueId.split(":")
            //         let attrObj = { valueId, attrId }
            //         // 携带给服务器的参数为对象
            //         attrArr.push(attrObj)
            //     }
            // })
            // // 整理后进行参数赋值
            // skuInfo.skuAttrValueList = attrArr
            // #endregion
            // 整理平台属性 方式二
            const { imageList, spuSaleAttrList, attrInfoList, skuInfo } = this
            // 整理并进行参数赋值
            skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
                // 如果有 attrIdAndValueId 代表为用户进行选择的图片
                if (item.attrIdAndValueId) {
                    // 进行字符切割
                    const [attrId, valueId] = item.attrIdAndValueId.split(":")
                    // 携带给服务器的参数为对象
                    prev.push({ attrId, valueId })
                }
                return prev
            }, [])
            // 整理销售属性
            skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
                if (item.attrIdAndValueId) {
                    const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(":")
                    prev.push({ saleAttrId, saleAttrValueId })
                }
                return prev
            }, [])
            // 整理图片数据
            skuInfo.skuImageList = imageList.map(item => {
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id
                }
            })
            // 发起请求
            let result = await this.$API.spu.reqAddSku(skuInfo)
            if (result.code == 200) {
                this.$message({ type: 'success', message: '添加成功' })
                // 触发自定义事件通知父组件将场景切换为0
                this.$emit('changeScenes', 0)
            }
        }
    },
}
</script>


<style scoped>

</style>