<template>
  <div class="count-wrap">
    <button @click="add">add</button>
    <div>{{ output }}</div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, reactive, ref, toRefs, watch, computed } from '@vue/composition-api';

export default defineComponent({
    components: {
      
    },
    props: {
      count: { required: true, type: Number },
    },
    setup(props, { emit }) {
        const output = computed(() => `当前数字为：${props.count}`);

        const add = () => emit('update', props.count + 1);

        return {
            add,
            output,
        };
    },
});
</script>
