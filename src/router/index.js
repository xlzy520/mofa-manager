import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/view/login/index.vue'
import Home from '@/view/home'
import Information from '@/view/home/information'
import Register from '@/view/login/register'
import BindCode from '@/view/home/bindCode'
import BindQRCode from '@/view/home/bindQrCode'

Vue.use(Router);

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: "首页",
      index: 10,
    }
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/information',
    component: Information,
    meta: {
      title: "激活码查询",
      index: 10,
    }
  },
  {
    path: '/register',
    component: Register,
    meta: {
      title: "注册",
      index: 10,
    }
  },
  {
    path: '/bindCode',
    component: BindCode,
    meta: {
      title: "绑定激活码",
      index: 10,
    }
  },
  {
    path: '/BindQRCode',
    component: BindQRCode,
    meta: {
      title: "绑定微信",
      index: 10,
    }
  },
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
