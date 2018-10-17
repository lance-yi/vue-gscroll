// 导入组件，组件必须声明 name
import gScroll from './src/x-scroll.vue'
// 为组件提供 install 安装方法，供按需引入
gScroll.install = function (Vue) {
  Vue.component(gScroll.name, gScroll)
}
// 默认导出组件
export default gScroll