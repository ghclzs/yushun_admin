import Vue from 'vue'
import App from './App.vue'
import 'weui'
import VueCompositionApi from '@vue/composition-api'
import VueRouter from 'vue-router';
import LuckyDrawWheel from './components/LuckyDrawWheel.vue';

const EmptyRoute = {
  render(createElement) {
    return createElement();
  },
};

Vue.config.productionTip = false
Vue.use(VueCompositionApi)
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Root',
    component: EmptyRoute,
  },
  {
    path: '/lucky-draw',
    name: 'LuckyDraw',
    component: LuckyDrawWheel,
  },
  {
    path: '/new-lucky-draw',
    name: 'NewLuckyDraw',
    component: LuckyDrawWheel,
  },
  {
    path: '/lucky-draw-tab',
    name: 'LuckyDrawTab',
    component: LuckyDrawWheel,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
