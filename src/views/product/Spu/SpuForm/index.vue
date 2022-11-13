<template>
    <div>
        <el-form ref="form" label-width="80px" :model="spu">
            <el-form-item label="Spu名称">
                <el-input placeholder="Spu名称" v-model="spu.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in tradeMarkList" :key="tm.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Spu描述">
                <el-input type="textarea" rows="4" placeholder="Spu描述" v-model="spu.description"></el-input>
            </el-form-item>
            <el-form-item label="Spu图片">
                <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="spuImageList"
                    :on-preview="handlePictureCardPreview" :on-success="handlerSuccess" :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" v-model="attrIdAndAttrName">
                    <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`"
                        v-for="(unSelect, index) in unSelectSaleAttr" :key="unSelect.id"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" style="margin: 0 10px;" :disabled="!attrIdAndAttrName"
                    @click="addSaleAttr">添加销售属性
                </el-button>
                <!-- 展示品牌销售属性 -->
                <el-table style="width: 100% ;margin: 5px 0;" border :data="spu.spuSaleAttrList">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="200"></el-table-column>
                    <el-table-column prop="prop" label="属性值名称列表" width="width">
                        <template slot-scope="{row,$index}">
                            <!-- 展示已有的属性值列表的数据 -->
                            <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable
                                :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                                {{ tag.saleAttrValueName }}
                            </el-tag>
                            <!-- @keyup.enter.native="handleInputConfirm"  -->
                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue"
                                ref="saveTagInput" size="small" @blur="handleInputConfirm(row)">
                            </el-input>
                            <!-- @click="showInput" -->
                            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="200">
                        <template slot-scope="{row,$index}">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>
import { type } from 'os';

export default {
    name: 'SpuForm',
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            // 存储Spu信息数据 
            spu: {
                "category3Id": 0,   // 三级分类id
                "tmId": "",      // 品牌id
                "description": "",    // Spu描述
                "spuName": "",  	//Spu名称
                // 收集Spu图片信息
                "spuImageList": [
                    // {
                    //     "id": 0,
                    //     "imgName": "string",
                    //     "imgUrl": "string",
                    //     "spuId": 0
                    // }
                ],
                // 平台销售属性收集
                "spuSaleAttrList": [
                    // {
                    //     "baseSaleAttrId": 0,
                    //     "id": 0,
                    //     "saleAttrName": "string",
                    //     "spuId": 0,
                    //     "spuSaleAttrValueList": [
                    //         {
                    //             "baseSaleAttrId": 0,
                    //             "id": 0,
                    //             "isChecked": "string",
                    //             "saleAttrName": "string",
                    //             "saleAttrValueName": "string",
                    //             "spuId": 0
                    //         }
                    //     ]
                    // }
                ],
            },
            tradeMarkList: [],      // 存储品牌信息
            spuImageList: [],        // 存储Spu图片
            saleAttrList: [],        // 存储品牌销售属性
            attrIdAndAttrName: '',      // 收集未选择的销售属性的id
        };
    },
    computed: {
        // 计算还未选择的销售属性  平台销售属性总共为3
        unSelectSaleAttr() {
            // 将平台的销售属性与Spu已有的销售属性进行对比，将Spu未有的销售属性过滤出来
            return this.saleAttrList.filter(item => {
                return this.spu.spuSaleAttrList.every(item1 => {
                    // 进行比较，返回布尔值
                    return item.name != item1.saleAttrName
                })
            })
        }
    },
    methods: {
        // 照片墙图片删除回调
        // file---被删除的图片      fileList---删除操作后剩余的图片
        handleRemove(file, fileList) {
            // console.log(file, fileList);
            // 收集照片墙数据
            this.spuImageList = fileList
        },
        // 照片墙图片预览回调
        handlePictureCardPreview(file) {
            // 将图片地址赋值给这个属性
            this.dialogImageUrl = file.url;
            // 对话框显示
            this.dialogVisible = true;
        },
        // 初始化SpuForm数据
        async initSpuData(spu) {
            // 获取Spu信息数据
            let spuResult = await this.$API.spu.reqSpu(spu.id)
            if (spuResult.code == 200) this.spu = spuResult.data
            // 获取品牌信息
            let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
            if (tradeMarkResult.code == 200) this.tradeMarkList = tradeMarkResult.data
            // 获取Spu图片
            let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
            if (spuImageResult.code == 200) {
                let listArr = spuImageResult.data
                // 由于照片墙展示图片需要数组中有name和url元素，因此将服务器返回的数据进行修改
                listArr.forEach(item => {
                    item.name = item.imgName
                    item.url = item.imgUrl
                })
                // 整理后进行赋值
                this.spuImageList = listArr
            }
            // 获取品牌销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList()
            if (saleResult.code == 200) this.saleAttrList = saleResult.data
        },
        // 照片墙图片上传成功的回调
        handlerSuccess(response, file, fileList) {
            // 收集图片信息
            this.spuImageList = fileList
        },
        // 添加新的销售属性
        addSaleAttr() {
            // 将收集到的销售属性进行切割
            const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':');
            // 向Spu的spuSaleAttrList中添加新的销售属性
            let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
            this.spu.spuSaleAttrList.push(newSaleAttr)
            // 清空选择框数据
            this.attrIdAndAttrName = ''
        },
        // 属性值添加按钮回调
        addSaleAttrValue(row) {
            // 通过row上的inputVisible属性来控制button和input的切换
            // 通过$set(),来添加响应式数据inputVisible
            this.$set(row, 'inputVisible', true)
            // 在row上添加响应式数据inputValue，用来收集新增销售属性值
            this.$set(row, 'inputValue', '')
        },
        // 销售属性值 input失去焦点的回调
        handleInputConfirm(row) {
            // 解构出销售属性需要收集的数据
            const { baseSaleAttrId, inputValue } = row
            // 判断是否为空
            if (inputValue.trim() == '') {
                this.$message('输入值不能为空')
                row.inputVisible = false
                return
            }
            // 判断属性值是否重复   
            //      重复返回 false      未重复返回 true
            let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
            // 如果重复，不执行后续操作
            if (!result) {
                this.$message('属性值重复')
                row.inputVisible = false
                return
            }
            // 将收集的属性值整理为服务器所需格式
            let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
            // 将数据添加到spuSaleAttrValueList，进行展示
            row.spuSaleAttrValueList.push(newSaleAttrValue)
            // 将input切换为button
            row.inputVisible = false
        },
        // 保存按钮的回调
        async addOrUpdateSpu() {
            // 整理参数
            // 将新增的照片添加 imgUrl，imgName 属性
            this.spu.spuImageList = this.spuImageList.map(item => {
                return {
                    imgName: item.name,
                    imgUrl: (item.response && item.response.data) || item.url
                }
            })
            // 发起请求
            let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
            if (result.code == 200) {
                this.$message({ type: 'success', message: '保存成功' })
                // 通过自定义事件，使父组件回到场景为0的页面
                this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
            }
            // 置空数据
            Object.assign(this._data, this.$options.data())
        },
        // 点击Spu添加按钮时，发送请求
        async addSpuData(category3Id) {
            // 收集父组件传递过来的三级分类的id
            this.spu.category3Id = category3Id
            // 获取品牌信息
            let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
            if (tradeMarkResult.code == 200) this.tradeMarkList = tradeMarkResult.data
            // 获取品牌销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList()
            if (saleResult.code == 200) this.saleAttrList = saleResult.data
        },
        // 点击取消按钮的回调
        cancel() {
            // 通知父组件切换场景为0    
            this.$emit('changeScene', { scene: 0, flag: '' })
            // 置空数据
            // 组件实例的this._data ---- 可以操作data中响应式数据
            // this.$options --- 可以获取配置对象，配置对象的data()执行，返回当前的data
            //    -----(响应式数据，当前的data初始状态为空，所以返回的data为空，再进行合并，可实现置空数据)
            Object.assign(this._data, this.$options.data())
        }   
    }
} 
</script>


<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>