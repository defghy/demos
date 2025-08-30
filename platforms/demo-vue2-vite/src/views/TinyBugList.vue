<template>
  <div class="tiny-bug-list">
    <div class="title">TinyVue问题演示</div>
    <tiny-form label-width="240px">
      <tiny-form-item label="点击radio-button没反应">
        <tiny-radio-group v-model="radioVal">
          <tiny-radio-button label="1">备选项 1</tiny-radio-button>
          <tiny-radio-button label="2">备选项 2</tiny-radio-button>
          <tiny-radio-button label="3">备选项 3</tiny-radio-button>
        </tiny-radio-group>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

import { useContext } from '@demo/utils'

export default defineComponent({
  setup() {
    const state = reactive({
      radioVal: '1',
    })

    return { ...toRefs(state) }
  },
})
</script>

<style scoped lang="less">
.tiny-bug-list {
  width: 100%;
  height: 100%;
  padding: 12px;
}
</style>
