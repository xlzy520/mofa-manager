import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/card/' + url, ...arg)
export default {
  check(data) {
    return fetch('check', data)
  },
  active({card, userId}) {
    return fetch(`active?card=${card}&userId=${userId}`)
  },
  
}
