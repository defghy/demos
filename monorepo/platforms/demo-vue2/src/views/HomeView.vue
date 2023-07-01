<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <CountHandler :count="form.count" @update="updateCount" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType, defineComponent, reactive, ref, toRefs, watch } from '@vue/composition-api';

import CountHandler from '@/components/CountHandler.vue';

export default defineComponent({
    components: {
      CountHandler
    },
    props: {},
    setup() {
        const state = reactive({
            form: {
                count: 0,
            },
        });

        const updateCount = function (val: number) {
          state.form.count = val;
        };

        return {
            ...toRefs(state),
            updateCount,
        };
    },
});
</script>
