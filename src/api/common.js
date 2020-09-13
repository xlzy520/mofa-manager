import fetch from './base/fetch'
export default {
  getVcode(data) {
    return fetch('/vcode/get', data, 'get')
  },
  getWork(data) {
    return fetch('/work/get', data, 'get')
  },
  getWxQrcode(data) {
    return fetch('/wx/login/getqrcode', data)
  },
  renewal({card, workId}) {
    return fetch(`/work/renewal?card=${card}&workId=${workId}`)
  },
  restart1(data) {
    return fetch('/wx/restart1/'+data.wxId, data)
  },
  restart2(data) {
    return fetch('/wx/restart2/'+data.wxId, data)
  },
  checkWxScanLogin(data) {
    return fetch('/wx/login/checklogin/werw', data)
  },
}
