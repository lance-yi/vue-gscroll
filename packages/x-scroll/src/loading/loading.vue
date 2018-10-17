<template>
  <div class="g-loading">
    <span class="g-loading-spinners" :style="style">
      <i class="g-loading-spinner" v-for="item in balde" :key="item"></i>
    </span>
  </div>
</template>
<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'g-loading'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        balde: 12
      }
    },
    props: {
      size: {
        type: Number
      }
    },
    computed: {
      style() {
        if (!this.size) {
          return
        }
        const value = `${this.size}px`
        return {
          width: value,
          height: value
        }
      }
    }
  }
</script>
<style lang="sass" rel="stylesheet/sass">
  $elements: 12
  .g-loading
    font-size: 14px !important
  .g-loading-spinners
    position: relative
    display: block
    width: 1em
    height: 1em
  .g-loading-spinner
    position: absolute
    left: 44.5%
    top: 37%
    width: 2px
    height: 25%
    border-radius: 50%/20%
    opacity: .25
    background-color: currentColor
    animation: spinner-fade 1s linear infinite
  @for $i from 1 through $elements
    .g-loading-spinner:nth-child(#{$i})
      animation-delay: (($i - 1) / 12)s
      transform: rotate(30deg * ($i - 6)) translateY(-150%)
  @keyframes spinner-fade
    0%
      opacity: .85
    50%
      opacity: .25
    100%
      opacity: .25

</style>
