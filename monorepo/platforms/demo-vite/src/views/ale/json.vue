<script setup lang="ts">
import { defineProps } from 'vue'
import { VueDd } from 'vue-dd'

defineProps<{ data: any, title: string }>()


</script>

<template>
<div class="title">{{ title }}</div>
<vue-dd max-height="95%" :model-value="data" preview="9" font-size="14px" open-level="2" line-height="16px" :dark="false" />
</template>

<style>
.title {
  padding: 4px 0;
  font-weight: bold;
  font-size: 14px;
}
</style>
