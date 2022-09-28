<template>
  <div>
    <el-form
      ref="form"
      label-width="80px"
      :model="spu"
    >
      <el-form-item label="SPU名称">
        <el-input
          placeholder="SPU名称"
          v-model="spu.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select
          placeholder="请选择品牌"
          v-model="spu.tmId"
        >
          <el-option
            v-for="(tm,index) in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          v-model="spu.description"
          type="textarea"
          rows="4"
          placeholder="描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="dev-api/admin/product/fileUpload"
          :file-list="spuImageList"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img
            width="100%"
            :src="dialogImageUrl"
            alt=""
          >
        </el-dialog>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            v-for="(unSelect,index) in unSelectSaleAttr"
            :key="unSelect.id"
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left:20px;"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <el-table
          style="width:100%;margin-top: 20px;"
          border
          :data="spu.spuSaleAttrList"
        >
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column
            label="属性名"
            width="100"
            prop="saleAttrName"
          ></el-table-column>
          <el-table-column
            label="属性值名称列表"
            width="width"
            prop="prop"
          >
            <!-- tag标签-s -->
            <template slot-scope="{row,$index}">
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
              >+ New Tag</el-button>
            </template>
            <!-- tag标签-e -->

          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100"
            prop="prop"
          >
            <template slot-scope="{row,$index}">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index,1)"
              ></el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="addOrUpdateSpu()"
        >保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      //标签需要的属性
      dynamicTags: [],
      inputValue: '',
      dialogImageUrl: '',
      dialogVisible: false,
      attrIdAndAttrName: '',
      spu: {
        category3Id: 0,
        description: '',
        spuName: '',

        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
        //品牌I
        tmId: '',
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
    };
  },
  computed: {
    unSelectSaleAttr() {
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
  methods: {
    //删除tag
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片上传成功后的回调
    handleSuccess(respond, file, fileList) {
      this.spuImageList = fileList;
    },
    //初始化spuform的数据
    async initSpuData(spu) {
      //获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        // 需要把服务器返回的数据修改
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();

      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加属性值的回调
    addSaleAttrValue(row) {
      this.$set(row, 'inputVisible', true);
      this.$set(row, 'inputValue', '');
    },
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == '') {
        return;
      }
      if (!row.spuSaleAttrValueList) {
        this.$set(row, 'spuSaleAttrValueList', []);
      }
      let result = row.spuSaleAttrValueList.every((item) => item.saleAttrValueName != inputValue);
      if (!result) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
      row.inputValue = '';
    },
    //添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':');
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrList: [] };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = '';
    },
    //保存||修改SPU
    async addOrUpdateSpu() {
      // 整理照片墙的数据
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: 'success', message: '保存成功' });
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' });
      }
      Object.assign(this._data, this.$options.data());
    },
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      console.log(saleResult);
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //取消按钮的回调
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '修改' });
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
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