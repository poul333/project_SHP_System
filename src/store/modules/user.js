// 引入登录 | 退出登录 | 获取用户信息接口
import { login, logout, getInfo } from '@/api/user'
// 获取token | 设置token | 删除token 函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块中重置路由方法
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
// 引入路由
import router from '@/router'

const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储头像
    avatar: '',
    // 服务器根据不同角色返回的标记信息
    // 菜单信息
    routes: [],
    // 角色信息
    roles: [],
    // 按钮权限信息
    buttons: [],
    // 对比之后 【异步路由与服务器返回的标记信息进行对比之后最终需要展示的路由】
    resultAsyncRoutes: [],
    // 用户最终需要展示的全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // #region
  // // 用户名
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // // 头像
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  // #endregion
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  // 最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // vuex 保存当前用户的异步路由
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户需要展示的所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    // 给路由器添加新路由
    router.addRoutes(state.resultAllRoutes)
  }
}

// 将返回的标记信息与异步路由进行对比
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户需要展示的路由
  return asyncRoutes.filter(item => {
    // 如果用户标记信息中包含item.name
    if (routes.indexOf(item.name) != -1) {
      // 因为异步路由结构多层，一次判断只能对比一级路由，所以使用递归进行进行对比
      //      如果有子元素
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // user login
  // 解构用户名和密码
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
    // #region
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    // #endregion
  },

  // get user info 获取用户信息
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token)
    // 获取用户信息，返回的数据包含，name,avatar, routes(不同用户应该展示那些菜单的标记),roles(用户角色的信息),buttons(按钮权限标记)
    if (result.code == 20000) {
      if (!result.data) {
        return reject('Verification failed, please Login again.')
      }
      // vuex存储用户全部信息
      commit('SET_USERINFO', result.data)
      // 计算需要的异步路由
      commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, result.data.routes))
      // #region
      // const { name, avatar } = result.data
      // commit('SET_NAME', name)
      // commit('SET_AVATAR', avatar)
      // #endregion
      // resolve(data)
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
    // #region
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response

    //     if (!data) {
    //       return reject('Verification failed, please Login again.')
    //     }

    //     const { name, avatar } = data

    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    // #endregion
  },

  // user logout  退出登录
  async logout({ commit, state }) {
    let result = await logout(state.token)
    if (result.code == 20000) {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
    // #region
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    // #endregion
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

