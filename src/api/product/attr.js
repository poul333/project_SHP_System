// 平台属性管理模块的请求

// 引入封装的axios
import request from '@/utils/request'

// 获取一级分类数据接口
// url: /admin/product/getCategory1
// method: get 
export const reqGetCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })

//获取二级分类数据接口
// url: /admin/product/getCategory2/{category1Id}
// method: get          parameters: category1Id
export const reqGetCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 获取三级分类数据接口
//  url: /admin/product/getCategory3/{category2Id}
// method: get          parameters: category2Id
export const reqGetCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })