// Spu模块的请求

// 引入封装的axios
import request from '@/utils/request'

// 获取Spu列表数据的接口
// url: /admin/product/{page}/{limit}
// method：get      parameters: page, limit, category3Id
export const rqeSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获取Spu信息
// url: /dmin/product/getSpuById/{spuId}
// method: get      parameters: spuId
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌信息
// url: /admin/product/baseTrademark/getTrademarkList       method: get
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// 获取Spu图片
// url: /admin/product/spuImageList/{spuId}
// method: get      parameters: spuId
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取品牌的全部销售属性
// url: /admin/product/baseSaleAttrList         method: get
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// 修改 | 添加 Spu
export const reqAddOrUpdateSpu = (spuinfo) => {
    // 如果携带参数带有id,则为修改spu
    if (spuinfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuinfo })
    } else {
        // 携带参数无id,则为添加
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuinfo })
    }
}

// 删除Spu
//  url: /admin/product/deleteSpu/{spuId}   method: delete      parameters: spuId
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 获取图片数据
// url: /admin/product/spuImageList/{spuId}     method: get         parameters: spuId
export const rqeSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性数据
// url: /admin/product/spuSaleAttrList/{spuId}  method: get         parameters: spuId
export const rqeSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性数据
// url: /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   
// method: get          parameters: category1Id，category2Id，category3Id
export const reqAttrInfoList = (category1Id, category2Id, category3Id) =>
    request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加sku
// url: /admin/product/saveSkuInfo      method: post
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

// 获取Sku列表数据
// url: /admin/product/findBySpuId/{spuId}  method: get    parameters: spuId
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })