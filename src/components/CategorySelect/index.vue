<template>
  <div>
    <!-- 
        :inline -- 行内表单 ，一行是否可以放置多个表单元素
     -->
    <el-form :inline="true" class="demo-form-inline" :model="cateForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cateForm.category1Id"
          @change="handler1"
        >
          <el-option
            :label="category1.name"
            :value="category1.id"
            v-for="(category1, index) in this.list1"
            :key="category1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cateForm.category2Id"
          @change="handler2"
        >
          <el-option
            :label="category2.name"
            :value="category2.id"
            v-for="(category2, index) in list2"
            :key="category2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cateForm.category3Id" @change="handler3">
          <el-option
            :label="category3.name"
            :value="category3.id"
            v-for="(category3, index) in list3"
            :key="category3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      // 一级分类数据
      list1: [],
      // 二级分类数据
      list2: [],
      // 三级分类数据
      list3: [],
      //   收集一到三级相应分类的id
      cateForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    // 当组件挂载完毕，向服务器获取一级分类的数据
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类的数据
    async getCategory1List() {
      // 发起请求获取数据
      let result = await this.$API.attr.reqGetCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    // 一级分类的select事件回调---(当一级分类的options发生变化时获取相应的二级分类的数据)
    async handler1() {
      // 将需要携带参数解构出来
      const { category1Id } = this.cateForm;
      // 发起请求获取二级分类的数据       // 通过一级分类的id获取二级分类的数据
      let result = await this.$API.attr.reqGetCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    // 二级分类的select事件回调---(当二级分类的options发生变化时获取相应的三级分类的数据)
    async handler2() {
      // 解构所携带参数
      const { category2Id } = this.cateForm;
      //   发起请求获取三级分类的数据
      let result = await this.$API.attr.reqGetCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    // 三级分类的事件回调
    handler3(){
        alert(123)
    }
  },
};
</script>

<style scoped></style>
