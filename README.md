# vue-gscroll 


基于vue scroll组件滚动列表,功能强大,配置简单,使用简单,提供了优质的原生滚动体验，便捷的配置项和事件，是一个基于`better-scroll`进行封装的组件,目标:偷懒+效率!


## 安装

```sh
$ npm install vue-gscroll --save
```

## 使用

  **main.js:**

```javascript
import Vue from 'vue'
import gScroll from 'vue-gscroll'

Vue.use(gScroll)
```
  **组件中使用,举例app.vue:**

```html
<template>
  <div id="app">
    <!-- 使用注意: 外部需要给一个高度 不然无法使用 -->
    <div class="app-wrapper">
      <g-scroll 
        ref="scroll" 
        :data="dataList" 
        :options="options"
        @pulling-down="refreshData" 
        @pulling-up="loadingMore">
        <!-- 你可以添加你的内容 -->
      </g-scroll>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      options: {
        scrollbar: true, // 是否淡入淡出
        pullDownRefresh: { // 下拉刷新配置
          threshold: 60, // 下拉刷新动作的下拉距离阈值 默认值 90
          stop: 0, // 回弹停留的位置
          stopTime: 600, // 刷新成功的文案显示时间 默认值 600 单位 ms
          txt: 'Refresh success',  // 刷新成功的文案 默认值 Refresh success
        },
        pullUpLoad: { // 上拉刷新配置
          threshold: 0, // 上拉刷新动作的上拉距离阈值 默认值 0
          txt: { // 上拉加载的相关文案 默认值 { more: '', noMore: '' }
            more: "loading...",
            noMore: "noMore Data"
          }
        }
      },
      count: 1,
    }
  },
  methods: {
    // 下拉刷新
    refreshData() {
      this.count = 1
      this.getData().then(res => {
        this.dataList = res
        this.$refs.scroll.forceUpdate()
      })
    },
    // 上拉加载更多
    loadingMore() {
      this.getData().then(res => {
        if(this.count < 100){
          this.dataList = this.dataList.concat(res)
        }
        this.$refs.scroll.forceUpdate()
      })
    },
    // 模拟数据
    getData() {
      return new Promise(resolve => {
        setTimeout(() => {
          const arr = []
          for (let i = 0; i < 20; i++) {
            arr.push(this.count++)
          }
          resolve(arr)
        }, 1000)
      })
    },
  },
  created() {
    this.refreshData()
  },
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.app-wrapper{
  height: 100vh;
}
</style>
```

## 滚动原理

由于 better-scroll 的滚动原理为：在滚动方向上，第一个子元素的长度超过了容器的长度。

那么对于 Scroll 组件，其实就是内容元素.g-scroll-content在滚动方向上的长度必须大于容器元素 .g-scroll-wrapper。根据滚动方向的不同，有以下两种情况：

1. 纵向滚动：内容元素的高度必须大于容器元素。由于容器元素的高度默认会被子元素的高度撑开，所以为了满足我们的滚动前提，你需要给 gscroll 组件的 .g-scroll-wrapper元素一个非弹性高度。
2. 横向滚动：内容元素的宽度必须大于容器元素。由于在默认情况下，子元素的宽度不会超过容器元素，所以需要给 gscroll 组件的 .g-scroll-content 元素设置大于 .g-scroll-wrapper 的宽度。


> 注意：任何时候如果出现无法滚动的情况，都应该首先查看内容元素`.g-scroll-content`的元素高度/宽度是否大于容器元素`.g-scroll-wrapper`的高度/宽度。这是内容能够滚动的前提条件。如果内容存在图片的情况，可能会出现 DOM 元素渲染时图片还未下载，因此内容元素的高度小于预期，出现滚动不正常的情况。此时你应该在图片加载完成后，比如 onload 事件回调中，手动调用 gscroll 组件的 `refresh()` 方法，它会重新计算滚动距离。


## Props 配置

| 参数      | 说明                                                                                                                | 类型   | 可选值                   | 默认值              |
| --------- | ------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------ | ------------------- |
| data      | 用于列表渲染的数据                                                                                                  | Array  | -                        | []                  |
| direction | 滚动方向                                                                                                            | String | 'vertical', 'horizontal' | 'vertical'          |
| options   | better-scroll 配置项，具体请参考[BS 官方文档](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html) | Object | -                        | { observeDOM: true, click: true, probeType: 1, scrollbar: false, pullDownRefresh: false, pullUpLoad: false } |
| scrollEvents^1.9.0^ | 配置需要派发的 scroll 事件 | Array | 可包含子项：'scroll', 'before-scroll-start', 'scroll-end' | [] |
| listenScroll | 是否派发 scroll 事件。`即将废弃`，推荐使用 `scroll-events` 属性 | Boolean | true/false | false |
| listenBeforeScroll | 是否派发 before-scroll-start 事件。`即将废弃`，推荐使用 `scroll-events` 属性 | Boolean | true/false | false |
| refreshDelay | data属性的数据更新后，scroll 的刷新延时 | Number | - | 20 |
| nestMode^1.11.0^ | 嵌套滚动模式，默认是`native`模式，只在开始滚动时判断是否到达边界并开启外层滚动，与浏览器原生的嵌套滚动保持一致。`free`模式下，内层滚动过程中只要触发边界，便会开启外层滚动。 | String | 'native', 'free' | 'native' |

`options`中 better-scroll 的几个常用配置项，`scrollbar`、`pullDownRefresh`、`pullUpLoad`这三个配置即可设为 `Boolean`（`false` 关闭该功能，`true` 开启该功能，并使用默认子配置），也可设为`Object`，开启该功能并具体定制其子配置项。

*   `scrollbar` 子配置项

| 参数 | 说明         | 类型    | 可选值     | 默认值 |
| ---- | ------------ | ------- | ---------- | ------ |
| fade | 是否淡入淡出 | Boolean | true/false | false  |

*   `pullDownRefresh` 子配置项

| 参数      | 说明                       | 类型   | 可选值 | 默认值                                       |
| --------- | -------------------------- | ------ | ------ | -------------------------------------------- |
| threshold | 下拉刷新动作的下拉距离阈值 | Number | -      | 90                                           |
| stop      | 回弹停留的位置             | Number | -      | 组件会自动计算回弹时显示的元素高度作为默认值 |
| stopTime  | 刷新成功的文案显示时间     | Number | -      | 600                                          |
| txt       | 刷新成功的文案             | String | -      | 'Refresh success'                            |

*   `pullUpLoad` 子配置项

| 参数      | 说明                       | 类型   | 可选值 | 默认值                   |
| --------- | -------------------------- | ------ | ------ | ------------------------ |
| threshold | 上拉刷新动作的上拉距离阈值 | Number | -      | 0                        |
| txt       | 上拉加载的相关文案         | Object | -      | { more: '', noMore: '' } |

## 插槽

| 名字     | 说明                             | 作用域参数                              |
| -------- | -------------------------------- | --------------------------------------- |
| default  | 基于`data`属性渲染的列表         | -                                       |
| pulldown | 位于列表上方，会在下拉刷新时显示 | pullDownRefresh: 是否开启了下拉刷新功能 |
pullDownStyle: 移入移出的样式
beforePullDown: 是否正在做下拉操作
isPullingDown: 是否正在拉取数据
bubbleY: 当前下拉的距离 - 50 |
| pullup | 位于列表下方，会在上拉加载时显示 | pullUpLoad: 是否开启了上拉加载功能
isPullUpLoad: 是否正在加载数据 |

## 事件

| 事件名              | 说明                                                                 | 参数                               |
| ------------------- | -------------------------------------------------------------------- | ---------------------------------- |
| click               | 点击列表项时触发                                                     | item - 该列表项的数据              |
| scroll              | 当 `scroll-events` 包含 `scroll` 时，根据 probeType 的值决定派发时机 | Object {x, y} - 实时滚动位置的坐标 |
| before-scroll-start | 当 `scroll-events` 包含 `before-scroll-start` 时，在滚动开始之前触发 | -                                  |
| scroll-end^1.9.0^   | 当 `scroll-events` 包含 `scroll-end` 时，在滚动结束时触发            | Object {x, y} - 实时滚动位置的坐标 |
| pulling-down        | 当 pullDownRefresh 属性为 true 时，在下拉超过阈值时触发              | -                                  |
| pulling-up          | 当 pullUpLoad 属性为 true 时，在上拉超过阈值时触发                   | -                                  |

## 方法

| 方法名   | 说明           | 参数        |
| -------- | -------------- | ----------- |
| scrollTo | 滚动到指定位置 | x: 横向位置 |
y: 纵向位置
time: 过渡动画时间
ease: 动画曲线 |
| forceUpdate | 标记上拉下拉结束，强制重新计算可滚动距离 | dirty: 是否有数据更新，默认为 false。true 表示有数据更新重新计算可滚动距离，上拉文案显示`pullUpLoad.text.more`值，false 表示没有数据更新，无需重新计算, 上拉文案显示`pullUpLoad.text.nomore`值 |
| disable | 禁用滚动 | - |
| enable | 启用滚动，默认是开启滚动的。 | - |
| resetPullUpTxt | 当从无更多切换到有更多时，重置上拉文本内容 | - |
| refresh | 刷新，重新计算高度且刷新 BetterScroll 实例 | - |

## 内部属性

| 属性名 | 说明                                                                                                                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| scroll | 可以通过该属性获得内部实现滚动核心的 BScoll 实例，从而获得更多 BScoll 的底层能力，如监听`touchEnd`事件，获得滚动中的中间状态等，具体可查看 [better-scroll 文档](http://ustbhuangyi.github.io/better-scroll/doc/zh-hans/) |