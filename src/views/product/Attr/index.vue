<template>
    <div>
        <el-card style="margin: 20px 0">
            <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px" :disabled="!category3Id"
                    @click="addAttr">添加属性</el-button>
                <!-- 表单---展示平台属性 -->
                <el-table style="width: 100%" border :data="attrList">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
                    <el-table-column prop="paop" label="属性值列表" width="width">
                        <template slot-scope="{ row, $index }">
                            <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
                                style="margin: 0px 10px">
                                {{ attrValue.valueName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paop" label="操作" width="150">
                        <template slot-scope="{ row, $index }">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 修改属性 | 新增属性 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" class="demo-form-inline" :model="attrInfo">
                    <el-form-item label="属性名" value="">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值
                </el-button>
                <el-button @click="isShowTable = true">取消</el-button>
                <el-table style="width: 100%; margin: 10px 0" border :data="attrInfo.attrValueList">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="prop" label="属性值名称" width="width">
                        <template slot-scope="{ row, $index }">
                            <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                                @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index">
                            </el-input>
                            <span v-else @click="toEdit(row, $index)" style="display:block;">{{ row.valueName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{ row, $index }">
                            <!-- 气泡确认框 -->
                            <el-popconfirm :title="`确认删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存
                </el-button>
                <el-button @click="isShowTable = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
// 按需引入lodash进行深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: "Attr",
    data() {
        return {
            // 一到三级分类相应id
            category1Id: "",
            category2Id: "",
            category3Id: "",
            //   接收平台属性字段
            attrList: [],
            //   控制tabel表格显示与隐藏
            isShowTable: true,
            //   收集新增属性 | 修改属性
            attrInfo: {
                attrName: "", // 属性名
                // 属性值，因为属性值可以有多个，故用数组
                attrValueList: [],
                categoryId: 0, // 三级分类的id
                categoryLevel: 3, // 用来区分几级分类
            },
        };
    },
    methods: {
        // 自定义事件回调 ---- 父子间传递分类id
        getCategoryId({ categoryId, level }) {
            // 区分三级分类相应的id,父组件进行存储
            if (level == 1) {
                this.category1Id = categoryId;
                // 发生变化时，将下级id置空
                this.category2Id = "";
                this.category3Id = "";
            } else if (level == 2) {
                this.category2Id = categoryId;
                // 下级id置空
                this.category3Id = "";
            } else {
                // 代表已经有了三级id
                this.category3Id = categoryId;
                // 获取平台属性数据
                this.getAttrList();
            }
        },
        // 发送请求获取平台属性数据
        async getAttrList() {
            const { category1Id, category2Id, category3Id } = this;
            let result = await this.$API.attr.reqAttrList(
                category1Id,
                category2Id,
                category3Id
            );
            if (result.code == 200) {
                this.attrList = result.data;
            }
        },
        // 添加属性值的回调
        addAttrValue() {
            //   向属性值的数组中添加元素
            this.attrInfo.attrValueList.push({
                // 在已有属性下新增属性时，把属性已有id赋值给属性值   添加属性时，由于新增属性还没有在服务器中有id，故属性值id为undefined
                attrId: this.attrInfo.id, // 相应属性名的id
                valueName: "", // 相应属性值
                // 给每一个属性值添加一个flag属性，每一个属性值都可以独立切换input和span 
                flag: true,
            });
            // 点击添加时，新增input框实现聚焦
            this.$nextTick(() => {
                // 新增属性值为数组最后一个
                this.$refs[this.attrInfo.attrValueList.length - 1].focus()
            })
        },
        //  添加属性按钮点击事件
        addAttr() {
            // 切换table的显示与隐藏
            this.isShowTable = false;
            //   置空数据
            this.attrInfo = {
                attrName: "",
                attrValueList: [],
                // 对三级分类的id进行收集
                categoryId: this.category3Id,
                categoryLevel: 3,
            };
        },
        // 修改某一个属性
        updateAttr(row) {
            this.isShowTable = false;
            //  将点击的属性编辑时进行展示
            //      由于数据复杂，以此使用深拷贝
            this.attrInfo = cloneDeep(row);
            // 修改某个属性时，给相应的属性值添加flag标记，用来切换编辑和查看模式
            this.attrInfo.attrValueList.forEach(item => {
                // $set --- 使添加的属性为响应式属性  参数一：要添加属性的项   参数二：属性名，  参数三：属性值
                this.$set(item, 'flag', false)
            })
        },
        // 添加属性时 input和span的切换
        toLook(row) {
            // row: 当前用户最新添加的属性值
            // 对用户输入的属性值进行非空判断
            if (row.valueName.trim() == '') {
                this.$message('请输入有效属性值')
                return
            }
            // 解决新增属性与已有属性重复
            let isRepat = this.attrInfo.attrValueList.some(item => {
                // row 为最新添加属性值，（数组最后一项）
                // 判断时，将row排除出去，以免row和自身进行判断
                if (row !== item) {
                    // 判断新增属性值是否和数组中已有属性值重复 ---- some 返回布尔值
                    return row.valueName == item.valueName
                }
            })
            // 如果新增属性与已有属性重复，不进行后续操作
            if (isRepat) return
            row.flag = false    // 编辑模式转为查看模式
        },
        // 点击查看模式span的回调 --- 切换为编辑模式
        toEdit(row, index) {
            row.flag = true,     // 切换为编辑模式
                // 获取input节点，实现自动聚焦
                //      点击span时，进行切换到input，页面的重绘重排需要时间，此时不能立马拿到input属性
                //      使用$nextTick，当节点渲染完毕时
                this.$nextTick(() => {
                    // 实现编辑时点击 input聚焦
                    this.$refs[index].focus()
                })
        },
        // 确认删除属性回调
        deleteAttrValue(index) {
            // 传入索引将点击的元素从数组中删除
            this.attrInfo.attrValueList.splice(index, 1)
        },
        // 保存数据
        async addOrUpdateAttr() {
            // 整理参数，过滤除需要的参数
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
                // 过滤出属性值不为空的
                if (item.valueName !== '') {
                    // 将带给服务器的参数，删除其中的flag属性
                    delete item.flag
                    return true
                }
            })
            // 发起请求
            try {
                // 请求成功
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
                // 成功的提示信息
                this.$message({ type: 'success', message: '保存成功' })
                // 重新获取列表数据
                this.getAttrList()
                // 信号量进行切换 ---- 保存后回到展示页面  
                this.isShowTable = true
            } catch (error) {
                this.$message('保存失败')
            }
        }
    },
};
</script>

<style scoped>

</style>
