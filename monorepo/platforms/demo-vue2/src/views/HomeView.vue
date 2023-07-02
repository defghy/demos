<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <CountHandler :count="form.count" @update="updateCount" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType, defineComponent, reactive, ref, toRefs, watch, provide, inject, computed, } from '@vue/composition-api';


import CountHandler from '@/components/CountHandler.vue';
import { useRootActions, useRootState } from '@/store';

export default defineComponent({
    name: 'Vue2Home',
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

        provide('useScene', 'Home');

        const updateCount = function (val: number) {
          state.form.count = val;
        };

        // vuex
        const { updateUser } = useRootActions(['updateUser']);
        updateUser('huyu');
        const { userName } = useRootState(['userName']);
        console.log(userName.value);

        return {
            ...toRefs(state),
            updateCount,
        };
    },
});
</script>
