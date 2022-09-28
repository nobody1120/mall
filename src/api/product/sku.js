//平台属性管理模块的请求文件
import request from '@/utils/request'

//获取图片的数据
// GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList=(spuId) =>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//获取销售属性的数据
// GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList=(spuId) => request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
//获取平台属性的数据
export const reqAttrInfoList=(category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//GET /admin/product/list/{page}/{limit}
// 获取sku列表
export const reqSkuList=(page,limit) =>request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

//上架
// GET /admin/product/onSale/{skuId}
export const reqSale=(skuId)=>request({url:`/admin/product/onSale/${skuId}`,method:'get'})

// 下架
// GET /admin/product/cancelSale/{skuId}
export const reqCancel=(skuId) => request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

// 获取sku详情
// GET /admin/product/getSkuById/{skuId}
export const reqSkuById=(skuId) => request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})