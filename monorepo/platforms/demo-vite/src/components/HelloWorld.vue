<script setup lang="ts">
import { ref, watch, provide, computed } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
const addCount = () => count.value++;
watch(() => count.value, (n, o) => {
  console.log(`updateCount: ${o} => ${n}`);
});
provide('count', count);

const card = ref<HTMLElement>();
const cardCompute = computed(() => card.value, {
  onTrack(e) {
    // triggered when count.value is tracked as a dependency
    e;
  },
  onTrigger(e) {
    console.log(`card: ${card.value} => ${e}`);
  }
});

console.log(cardCompute.value);
</script>

<template>
  <h1>{{ msg }}</h1>

  <div ref="card" class="card">
    <button type="button" @click="addCount">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
