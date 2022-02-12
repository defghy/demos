<template>
  <div class="home">
    <button @click="openDialog">Click Me Open Dialog</button>
  </div>
</template>

<script>
// @ is an alias to /src
import modal from '@/components/modal/modal';
import Popup from './popup.vue';

export default {
  name: 'DevtoolInspect',
  components: {},
  methods: {
    openDialog() {
      modal({
        content: Popup,
        props: {
          num: 1024
        },
      });
    }
  }
}
</script>

<style lang="less" scoped>

</style>
