// sku请求模块

// 引入封装的axios
import request from '@/utils/request'

// 获取Sku列表数据
// url: /admin/product/list/{page}/{limit}      method: get     parameters: page , limit
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// sku商品上架
// url: /admin/product/onSale/{skuId}       method: get         parameters: skuId
export const reqOnSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// sku商品下架
// url: /admin/product/cancelSale/{skuId}   method: get         parameters: skuId
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 获取sku商品详情
// url: /admin/product/getSkuById/{skuId}   method: get         parameters: skuId
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })