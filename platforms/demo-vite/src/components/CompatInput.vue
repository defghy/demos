<template>
  <h1>{{ modelValue }}</h1>
  <button type="button" @click="add">add</button>
</template>

<script lang="ts">
import { ref, watch, provide, computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: { type: Number, required: true },
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  setup(props, { emit }) {
    const add = function () {
      const newVal = props.modelValue + 1
      emit('update:modelValue', newVal)
      emit('change', newVal)
    }
    return { add }
  },
})
</script>

<style scoped lang="less"></style>
