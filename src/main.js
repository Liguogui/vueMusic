import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'common/stylus/index.styl'
import 'swiper/dist/css/swiper.css' //VueAwesomeSwiper自带样式

/*eslint-disable no-unused-vars*/
// import VConsole from 'vconsole'
// let vConsole =new VConsole();

fastclick.attach(document.body)

Vue.use(VueLazyload,{
  loading:require('common/image/default.png')
})
Vue.use(VueAwesomeSwiper)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  // components: { App },
  // template: '<App/>'
  render: h => h(App)
})
