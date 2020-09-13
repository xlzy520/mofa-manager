import Vue from 'vue';
import App from './App';
import { router } from './router';
import store from "./store";
import { Toast, Checkbox, Popup, Icon } from "vant";

Vue.use(Checkbox)
Vue.use(Popup)
Vue.use(Icon)

function initSize() {
  var o, n, i, a, r;
  o = document,
    n = window,
    i = o.documentElement,
    a = "orientationchange"in window ? "orientationchange" : "resize",
    r = function() {
      var e = i.clientWidth;
      e && (e > 750 && (e = 750),
        i.style.fontSize = e / 750 * 100 + "px")
    }
    
  o.addEventListener && (n.addEventListener(a, r, !1),
  o.addEventListener("DOMContentLoaded", r, !1))
}

initSize()
import './index.less'
Toast.setDefaultOptions({ duration: 2000 });
Vue.prototype.$toast = Toast

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
