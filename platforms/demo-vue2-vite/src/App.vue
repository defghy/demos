<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="keepAlive" />
    </keep-alive>
    <router-view v-if="!keepAlive" />
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

import { useContext } from '@demo/utils'

export default defineComponent({
  components: {},
  setup(props, { emit }) {
    const { $route } = useContext()
    const keepAlive = computed(() => {
      return $route.meta?.keepAlive
    })

    return {
      keepAlive,
    }
  },
})
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
  height: 100%;
}

// 阿里字体图标设置
.icon,
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
</style>
