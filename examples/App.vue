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
