import fetch from './base/fetch'
export default {
  getVcode(data) {
    return fetch('/vcode/get', data, 'get')
  },
  getWork(data) {
    return fetch('/work/get', data, 'get')
  },
  getWxQrcode(data, headers) {
    return fetch('/wx/login/getqrcode', data, 'post', {headers})
  },
  renewal({card, workId}) {
    return fetch(`/work/renewal?card=${card}&workId=${workId}`)
  },
  restart1(data, headers) {
    return fetch('/wx/restart1/'+data.wxId, data, 'post', {headers})
  },
  restart2(data, headers) {
    return fetch('/wx/restart2/'+data.wxId, data, 'post', {headers})
  },
  checkWxScanLogin(data, headers) {
    return fetch('/wx/login/checklogin/'+data.uuid, data, 'post', {headers})
  },
}
