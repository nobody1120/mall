<template>
  <div>
    <el-card>
      <!-- 三级联动 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene!=0"
      ></CategorySelect>
    </el-card>
    <el-card style="margin:20px 0;">
      <div v-show="scene==0">
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
        >添加spu</el-button>

        <!-- 列表结构 -->
        <el-table
          style="width:100%;margin-top: 20px;"
          border
          :data="records"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <!-- 添加 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <!-- 修改 -->
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <!-- 详情 -->
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handle(row)"
              ></hint-button>
              <!-- 删除 -->
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3,5,10]"
          :page-count="7"
          layout="prev,pager,jumper,->,sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          style="margin-top:20px ;text-align: center;"
        ></el-pagination>
      </div>
      <!-- 添加|修改SPU -->
      <SpuForm
        v-show="scene==1"
        @changeScene="changeScene"
        ref="spu"
      >spu</SpuForm>
      <!-- 添加sku -->
      <SkuForm
        v-show="scene==2"
        ref="sku"
        @changeScenes="changeScenes"
      >sku</SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table
        v-loading="loading"
        style="width:100%"
        :data="skuList"
        border
      >
        <el-table-column
          prop="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
        ></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row,$index}">
            <img
              :src="row.skuDefaultImg"
              style="width:100px;height:100px"
            ></img>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';
export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      dialogTableVisible: false,
      loading: true,
      skuList: [],
      spu: {},
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      total: 0,
      records: [],
      scene: 0, //切换视角，0：spu列表，1：添加|修改spu，2：添加sku
    };
  },
  methods: {
    // handleCurrentChange(page) {
    //   this.page = page;
    //   this.getSpuList();
    // },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = '';
        this.category3Id = '';
      } else if (level == 2) {
        this.category3Id = '';
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      //参数page，limit，id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改某一个spu的
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    //spuForm自定义事件的回调
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == '修改') {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: 'succsee', message: '删除成功' });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    changeScenes(scene) {
      this.scene = scene;
    },
    async handle(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      let result = await this.$API.spu.reqSkuList(row.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    close(done) {
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style>
</style>