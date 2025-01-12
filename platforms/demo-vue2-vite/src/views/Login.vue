<template>
  <div class="k-login-page">
    <h1>Login</h1>
    <el-button type="primary" class="login-btn" @click="handleSSO">SSO 登录</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useContext } from '@demo/utils'

export default defineComponent({
  setup() {
    const { $router } = useContext()

    const handleSSO = function () {
      console.log('login')
    }

    return { handleSSO }
  },
})
</script>

<style scoped lang="less">
.k-login-page {
  width: 100%;
  height: 100%;
  padding-top: 250px;
  text-align: center;
  .login-btn {
    width: 200px;
  }
}
</style>
