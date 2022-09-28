<template>
  <div>
    <el-card>
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card style="margin:20px 0;">
      <div v-show="isShowTable">
        <el-button
          :disabled="!category3Id"
          type="primary"
          icon="el-icon-plus"
          @click="addAttr"
        >添加属性</el-button>
        <el-table
          border
          :data="attrList"
          style="margin:20px 0;"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            prop="attrName"
            align="center"
            width="150"
          ></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag
                type="success"
                v-for="(attrValue,index) in row.attrValueList"
                :key="attrValue.id"
                style="margin:0 5px;"
              >{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
          >
            <template slot-scope="{row,$index}">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改|添加属性的结构 -->
      <div v-show="!isShowTable">
        <el-form
          :inline="true"
          ref="form"
          label-width="80px"
        >
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left:20px"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
        >添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table
          style="width:100%; margin:20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="属性值名称"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row,$index)"
              >{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length<1"
        >保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      flag: true,
      //控制table的显示和控制
      isShowTable: true,
      //收集||修改属性使用
      attrInfo: {
        attrName: '',
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
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
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        //给每一个属性值加一个flag
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮的回调
    addAttr() {
      //切换Table的显示
      //收集三级分类的Id
      this.isShowTable = false;
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    //修改属性的回调
    updateAttr(row) {
      this.isShowTable = false;
      //由于数据结构复杂，存在对象里面套数组，数组里面套对象，需要使用深拷贝解决问题
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        //因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
        //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
        this.$set(item, 'flag', false);
      });
    },
    //失焦相应的回调
    toLook(row) {
      //如果属性值为空
      if (row.valueName.trim() == '') {
        this.$message('请你输入一个正常的属性值');
        return;
      }
      //新增的属性值，不能和已有的属性值重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      //如果重复不执行后面的代码
      if (isRepeat) return;
      row.flag = false;
    },
    //编辑的回调
    toEdit(row, index) {
      row.flag = true;
      //获取input标签
      //对于浏览器而言，页面的重新绘制与重排需要时间
      //$nextTick()
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //删除属性的回调
    deleteAttrValue(index) {
      //不需要发请求
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //添加或者修改属性的按钮
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        if (item.valueName != '') {
          delete item.flag;
          return true;
        }
      });
      try {
        let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message({ type: 'success', message: '保存成功' });
        this.getAttrList();
      } catch (error) {
        this.$message({ type: 'warning', message: '保存失败' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>