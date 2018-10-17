import Vue from 'vue'
import App from './App.vue'
import gScroll from '../packages/index'

Vue.use(gScroll)

Vue.config.productionTip = false


new Vue({
  render: h => h(App)
}).$mount('#app')
