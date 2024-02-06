<template>
  <div class="popup">
    I'm a component; <br /> 
    Try to inspect me...
  </div>
</template>

<script>
export default {
  name: 'TestPopup',
  components: {},
  props: {
    num: { default: 1 },
  },
  data() {
    return {
      name: 'test'
    };
  },
}
</script>

<style lang="less" scoped>
.popup {
  position: absolute; left: 0; right: 0; margin: auto; top: 0; bottom: 0;
  background:  #fff;
  width: 300px; height: 100px;
}
</style>
