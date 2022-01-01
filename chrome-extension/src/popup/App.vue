<template>
  <ElForm class="container" label-position="left" label-width="60px" size="mini" @submit.prevent>
    <el-button
      type="primary"
      class="btn-set-cookie"
      @click="test"
    >
      test
    </el-button>
  </ElForm>
  <div class="title">测试</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus'

import api from '@/utils/api';

export default defineComponent({
  name: 'App',
  components: {
  },
  setup(props, context) {
    const tabPageId = ref(0);

    return {
      location: reactive({ href: '' }),
      tabPageId
    };
  },
  created() {
    this.initEnv();
  },
  methods: {
    async test() {
      const { data } = await api.sendTabMessage('server:fetch-iframe-src') as any;
      const iframeHost = data.data?.host;
      ElMessage.success(iframeHost);
    },
    async initEnv() {
      const [ tab ]= await chrome.tabs.query({ active: true, currentWindow: true });
      this.tabPageId = tab.id || 0;
      const url: any = tab?.url;
      const { href, host, pathname, search, origin } = new URL(url);

      Object.assign(this.location, {
        href,
        host,
        pathname,
        search,
        origin
      });
    }
  }
})
</script>

<style lang="less">
body {
  position: relative;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 400px;
  overflow: hidden;
}

.el-form-item.el-form-item--mini {
  .el-button--mini {
    padding: 7px 10px;
  }
}
</style>

<style lang="less" scoped>
  .title {
    font-size: 14px;
    text-align: left;
    margin: 0;
  }

  .container {
    margin: 20px 10px;
    height: 285px;
    overflow-y: overlay;

    .func-block {
      margin-bottom: 10px;
      border-bottom: 4px solid rgba(50, 125, 255, 0.16);
    }
    .el-form {
      height: 100%;
    }
    /deep/ .el-form-item.el-form-item--mini {
      .el-form-item__label {
        font-size: 12px;
        font-weight: bold;
      }
      .el-form-item__content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }
  }

  .more-link {
    margin-left: 15px;
    cursor: pointer;
  }
</style>
