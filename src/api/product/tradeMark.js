// 获取品牌管理数据的模块

// 引入axios(进行二次封装)
import request from '@/utils/request'

// 获取品牌列表接口
//  url: /admin/product/baseTrademark/{page}/{limit}
// method: get          parameters: page , limit
export const reqTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 新增品牌接口
// url: /admin/product/baseTrademark/save 
// method: post         parameters: 品牌名称 , 品牌logo

// 修改品牌的接口
// url: /admin/product/baseTrademark/update  
// method: put          parameters: id ，品牌名称 ， 品牌logo

// 将新增和修改封装为一个函数 
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    // 如果参数中带有id,则为修改请求
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', date: tradeMark })
    } else {
        // 新增接口
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}

// 删除品牌列表
// url: /admin/product/baseTrademark/remove/{id}
// method: delete       parameters: id
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })