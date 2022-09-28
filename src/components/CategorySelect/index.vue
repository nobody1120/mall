<template>
  <div>
    <!-- inline 代表行内表单，代表一行可以放置多个表单元素 -->
    <el-form
      :inline="true"
      class="demo-form-inline"
      :model="cForm"
    >
      <!-- 一级分类 -->
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handle1"
          :disabled="show"
        >
          <el-option
            v-for="(c1,index) in list1"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
          <!-- 二级分类 -->
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handle2"
          :disabled="show"
        >
          <el-option
            v-for="(c2,index) in list2"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 三级分类 -->
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handle3"
          :disabled="show"
        >
          <el-option
            v-for="(c3,index) in list3"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      //收集相应分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //一级分类的回调
    async handle1() {
      //清楚二三级分类
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = '';
      this.cForm.category3Id = '';
      const { category1Id } = this.cForm;
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 });
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    //二级分类的回调
    async handle2() {
      //清楚三级分类
      this.list3 = [];
      this.cForm.category3Id = '';
      const { category2Id } = this.cForm;
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 });
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    //三级分类的回调
    async handle3() {
      const { category3Id } = this.cForm;
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>