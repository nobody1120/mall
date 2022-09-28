import request from '@/utils/request'
//GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList=(page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})
//POST /admin/product/baseTrademark/save 新增品牌 参数：名称，logo

//PUT /admin/product/baseTrademark/update 修改品牌 参数：id，名称，logo
export const reqAddOrUpdateTradeMark=(tradeMark)=>{
  if(tradeMark.id){
    return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
  }else{
    return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
  }
}

// DELETE /admin/product/baseTrademark/remove/{id} 删除品牌
export const reqDeleteTradeMark=(id) =>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})