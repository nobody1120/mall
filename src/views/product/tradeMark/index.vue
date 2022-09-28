<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin:10px 0;"
      @click="showDialog"
    >添加</el-button>
    <!-- 
      data：表格将来展示的数据---数组类型

    -->
    <el-table
      style="width:100%"
      border
      :data="list"
    >
      <el-table-column
        type="index"
        label="序号"
        prop="prop"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="品牌名称"
        prop="tmName"
        width="width"
      ></el-table-column>
      <el-table-column
        label="品牌Logo"
        prop="prop"
        width="width"
      > <template slot-scope="{row,$index}">
          <img
            :src="row.logoUrl"
            style="width:100px;height:100px;"
            alt=""
          ></template>
      </el-table-column>
      <el-table-column
        label="操作"
        prop="prop"
        width="width"
      >
        <template slot-scope="{row,$index}">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      style="margin-top:20px ;text-align: center;"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3,5,10]"
      layout="prev,pager,next ,jumper,->,sizes,total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    ></el-pagination>

    <!-- 对话框 
    :model属性把表单数据收集到对象身上
    Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
    并将 Form-Item 的 prop 属性设置为需校验的字段名即可。校验规则参见 async-validator

    -->
    <el-dialog
      :title="tmForm.id?'修改品牌':'添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="ruleForm"
        :rules="rules"
        style="width:80%;"
        :model="tmForm"
      >
        <el-form-item
          label="品牌名称"
          label-width="100px"
          prop="tmName"
        >
          <el-input
            autocomplete="off"
            v-model="tmForm.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="品牌Logo"
          label-width="100px"
          prop="logoUrl"
        >
          <!-- 收集数据不能使用v-model，不是表单元素 
          :on-success="handleAvatarSuccess"检测图片上传成功会执行一次
          :before-upload="beforeAvatarUpload"在上传成功之前会执行一次
        -->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tmForm.logoUrl"
              :src="tmForm.logoUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
            <div
              slot="tip"
              class="el-upload__tip"
            >只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="
          primary"
          @click="addOrUpdateTradeMark"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data() {
    var validateTmName = (rule, value, callback) => {
      //自定义校验规则
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称需要2-10位'));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      //对话框显示和隐藏，默认隐藏
      dialogFormVisible: false,
      //上传图片使用的属性
      imageUrl: '',
      //收集品牌的信息
      tmForm: {
        tmName: '',
        logoUrl: '',
      },
      rules: {
        //品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'blur' },
        ],
        //品牌logo的验证规则
        logoUrl: [{ required: true, message: '请选择品牌的图片' }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    //获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    showDialog() {
      this.tmForm = { tmName: '', logoUrl: '' };
      this.dialogFormVisible = true;
    },
    //row:当前用户选中的品牌信息
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //浅拷贝，复制了一份数据，修改后不变展示的数据
      this.tmForm = { ...row };
    },
    //图片操作
    handleAvatarSuccess(res, file) {
      //res是上传成功之后返回的数据
      //file也是一样
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    addOrUpdateTradeMark() {
      //全部验证表单通过才能继续
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
          if (result.code == 200) {
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改成功' : '添加成功',
            });
            //修改品牌留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      //确定的回调
    },
    //删除品牌
    deleteTradeMark(row) {
      this.$confirm(`你确定是否删除${row.tmName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
  },
};
</script>

<style lang="scss">
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