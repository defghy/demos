<script setup lang="ts">
import { rawData, ubfData, editorData } from './aleData'
import viewer from './json.vue'

</script>

<template>
  <div class="jsons">
    <div class="json-wrapper">
      <viewer title="rawData" :data="rawData" />
    </div>
    <div class="json-wrapper">
      <viewer title="编辑侧数据" :data="editorData" />
    </div>
    <div class="json-wrapper">
      <viewer title="ubfData" :data="ubfData" />
    </div>
  </div>

</template>

<style>
.jsons {
  display: flex;
  width: 100%;
  height: 100%;
  .json-wrapper {
    flex: 1;
    overflow: auto;
    height: 100%;
  }
}
</style>
