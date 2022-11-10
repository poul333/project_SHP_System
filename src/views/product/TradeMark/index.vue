<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 10px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 
            表格
                data:   表格组件将来需要展示的数据----数组类型
                border:     给表格添加边框
                column属性:
                    label:  显示标题
                    width:  对应列的宽度
                    align:  对齐方式
                    prop:   对应列的内容
         -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- 无法决定样式与解构，使用作用域插槽 -->
        <template slot-scope="{ row, $index }">
          <!-- 将数据进行回传 -->
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 15px; text-align: center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @current-change="this.getPageList"
      @size-change="handlerSizeChange"
      layout="prev,pager,next,jumper,->,total,sizes"
    ></el-pagination>
    <!-- 
      对话框
        :visible.sync 控制对话框显示与隐藏
    -->
    <el-dialog
      :title="this.tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 :model="tmForm"将数据收集到tmForm-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
            上传logo图片
              action: 设置图片的上传地址
              :on-success --- 当图片上传成功执行一次
              :before-upload --- 在图片上传之前执行一次
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { Row } from "element-ui";

import { async } from "q";

export default {
  name: "TradeMark",
  data() {
    // 自定义校验规则 --- 品牌名称
    var validateName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 15) {
        callback(new Error('"长度在 2 到 15 个字符"'));
      } else {
        callback();
      }
    };
    return {
      // 代表分页器第几页
      page: 1,
      // 当前页展示数据条数
      limit: 3,
      // 数据总条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框是否显示
      dialogFormVisible: false,
      // 收集表单信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // 自定义校验规则
          { validator: validateName, trigger: "change" },
          // { min:2,max: 15, message: "长度在 2 到 15 个字符",trigger: "change",},
        ],
        logoUrl: [{ required: true, message: "请选择logo图片" }],
      },
    };
  },
  mounted() {
    // 组件挂载完毕发送请求
    this.getPageList();
    // console.log(this.$API);
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager;
      // 将请求所需携带的参数解构出来
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMark(page, limit);
      // 如果请求成功
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 分页器点击事件
    // handlerCurrentChange(pager){
    //   this.page = pager
    //   this.getPageList()
    // }
    // 当分页器某一页展示数据条数发生改变时
    handlerSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌按钮事件
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      // 每次点击清空之前的数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 修改按钮的事件
    updateTradeMark(row) {
      // row: 当前点击的品牌信息
      // 显示对话框
      this.dialogFormVisible = true;
      // 将修改的品牌信息赋值给tmForm 进行展示
      // 进行浅拷贝
      this.tmForm = { ...row };
    },
    // 上传品牌logo回调
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // 收集品牌logo图片数据,将来带给服务器
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 确定按钮点击事件 (添加品牌 | 修改品牌)
    addOrUpdateTradeMark() {
      // 表单验证全部通过后,再进行后续操作
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部验证成功
        if (success) {
          this.dialogFormVisible = false;
          // 发送请求 (新增 | 修改)
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          // 成功
          if (result.code == 200) {
            // 弹出消息: 新增成功 | 修改成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改成功" : "新增成功",
            });
            // 发起请求,重新获取列表数据
            // 如果为新增,停留在第一页,如果为修改,则停留在修改的当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`是否要删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击确定按钮时触发
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id); // 发起删除请求
          console.log(result);
          if (result.code == 200) {
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1); // 重新获取列表
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            alert(result.message);
          }
        })
        .catch(() => {
          // 点击取消按钮时触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
/* 上传logo图片框样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
