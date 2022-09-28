<template>
  <div>
    <el-form
      ref="form"
      label-width="100px"
    >
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input
          placeholder="SKU名称"
          v-model="skuInfo.skuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          placeholder="重量(千克)"
          v-model="skuInfo.weight"
        ></el-input>

      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          row="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form
          :inline="true"
          ref="forms"
          label-width="80px"
        >
          <el-form-item
            :label="attr.attrName"
            v-for="(attr,index) in attrInfoList"
            :key="attr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="attr.attrIdAndValueId"
            >
              <el-option
                v-for="(attrValue,index) in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form
          :inline="true"
          ref="forms"
          label-width="80px"
        >
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr,index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleAttr.attrIdAndValueId"
            >
              <el-option
                v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width:100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            prop="prop"
            label=""
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column
            label="图片"
            width="150"
            align="center"
          ><template slot-scope="{row,$index}">
              <img
                :src="row.imgUrl"
                style="width:100px;height:100px"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            prop="imgName"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button
                type="primary"
                v-if="row.isDefault==0"
                @click="changeDefault(row)"
              >设置默认</el-button>
              <el-button v-else> 默认</el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button
          type="primary"
          @click="save"
        >保存</el-button>
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
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        skuName: '',
        weight: '',
        skuDesc: '',
        skuDefaultImg: '', //默认图片

        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          },
        ],
        skuImageList: [
          {
            id: 0,
            imgName: 'string',
            imgUrl: 'string',
            isDefault: 'string',
            skuId: 0,
            spuImgId: 0,
          },
        ],
        skuSaleAttrValueList: [
          {
            id: 0,
            saleAttrId: 0,
            saleAttrName: 'string',
            saleAttrValueId: 0,
            saleAttrValueName: 'string',
            skuId: 0,
            spuId: 0,
          },
        ],
      },
      spu: {},
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      imageList: [],
    };
  },
  methods: {
    async getData(category1Id, category2Id, row) {
      this.spu = row;
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      //获取图片
      let result = await this.$API.sku.reqSpuImageList(row.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      let result1 = await this.$API.sku.reqSpuSaleAttrList(row.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      let result2 = await this.$API.sku.reqAttrInfoList(category1Id, category2Id, row.category3Id);
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
      console.log(result, result1, result2);
    },
    handleSelectionChange(params) {
      this.imageList = params;
    },
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      Object.assign(this._data, this.$options.data());
      this.$emit('changeScenes', 0);
    },
    async save() {
      //整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      // let arr = [];
      // attrInfoList.forEach((item) => {
      //   if (item.attrIdAndValueId) {
      //     const [attrId, valueId] = item.attrIdAndValueId.split(':');
      //     let obj = { valueId, attrId };
      //     arr.push(obj);
      //   }
      // });
      // skuInfo.skuAttrValueList = arr;
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':');
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleValueId] = item.attrIdAndValueId.split(':');
          prev.push({ saleAttrId, saleValueId });
        }
        return prev;
      }, []);
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgUrl,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: 'success', message: '保存成功' });
        this.$emit('changeScenes', 0);
        Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style>
</style>