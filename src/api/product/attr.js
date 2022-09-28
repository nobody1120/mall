//平台属性管理模块的请求文件
import request from '@/utils/request'

// GET /admin/product/getCategory1 获取一级分类的数据
export const reqCategory1List =()=>request({url:'/admin/product/getCategory1',method:'get'})

// /admin/product/getCategory2/{category1Id} 获取二级分类的数据
export const reqCategory2List=(category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

// /admin/product/getCategory3/{category2Id} 获取三级分类的数据
export const reqCategory3List=(category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}获取平台属性
export const reqAttrList=(category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//POST /admin/product/saveAttrInfo添加属性值
export const reqAddOrUpdateAttr=(data)=>request({url:'/admin/product/saveAttrInfo',data,method:'post'})
// {
//   "attrName": "string",
//   "attrValueList": [
//     {
//       "attrId": 0,
//       "id": 0,
//       "valueName": "string"
//     }
//   ],
//   "categoryId": 0,
//   "categoryLevel": 0,
//   "id": 0
// }