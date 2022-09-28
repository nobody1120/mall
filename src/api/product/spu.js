//平台属性管理模块的请求文件
import request from '@/utils/request'

//获取spu列表
// GET /admin/product/{page}/{limit}
export const reqSpuList=(page,limit,category3Id)=> request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

// GET /admin/product/getSpuById/{spuId}
//获取spu信息
export const reqSpu=(spuId) => request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

// GET /admin/product/baseTrademark/getTrademarkList
//获取品牌列表
export const reqTradeMarkList=() => request({url:'/admin/product/baseTrademark/getTrademarkList',metdod:'get'})

// GET /admin/product/spuImageList/{spuId}
//获取spu图片
export const reqSpuImageList=(spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//GET /admin/product/baseSaleAttrList
//获取频台全部销售属性
export const reqBaseSaleAttrList=() =>request({url:'/admin/product/baseSaleAttrList',method:'get'})

//修改和添加spu
// POST /admin/product/saveSpuInfo
// POST /admin/product/updateSpuInfo

export const reqAddOrUpdateSpu=(spuInfo) => {
  if(spuInfo.id){
    return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
  }else{
    return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
  }
}

//删除spu
// DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu=(spuId) =>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

// POST /admin/product/saveSkuInfo
//添加Sku
export const reqAddSku=(skuInfo) => request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

//获取sku列表
// GET /admin/product/findBySpuId/{spuId}
export const reqSkuList=(spuId) => request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})