import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/user/' + url, ...arg)
export default {
  login(data) {
    return fetch('login', data)
  },
  register(data) {
    return fetch('register', data)
  },
}
