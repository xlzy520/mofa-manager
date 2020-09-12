
const state = {
  userInfo: {}
}

const mutations = {
  SET_USER_DATA: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  saveUserInfo({ commit }, userInfo){
    console.log(userInfo);
    localStorage.setItem('token', userInfo.token)
    localStorage.setItem('username', userInfo.UserInfo.login_name)
    localStorage.setItem('userId', userInfo.UserInfo.id)
    commit('SET_USER_DATA', userInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

