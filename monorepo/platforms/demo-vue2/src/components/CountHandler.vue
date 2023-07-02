<template>
  <div class="count-wrap">
    <button @click="add">add</button>
    <div>{{ output }}</div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, reactive, ref, toRefs, watch, computed, inject } from '@vue/composition-api';

export default defineComponent({
    components: {
      
    },
    props: {
      count: { required: true, type: Number },
    },
    setup(props, { emit }) {
        const useScene = inject('useScene');

        const output = computed(() => `场景${useScene}的数字为：${props.count}`);

        const add = () => emit('update', props.count + 1);

        return {
            add,
            output,
        };
    },
});
</script>
