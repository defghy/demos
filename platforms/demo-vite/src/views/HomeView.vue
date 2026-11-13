<script setup lang="ts">
import { RouterLink } from 'vue-router'

const pages = [
  { title: 'HTML in Canvas 特效', to: { name: 'html-in-canvas' } },
  { title: 'HTML in Canvas · PixiJS 极简示例', to: { name: 'html-in-canvas-2' } },
  { title: 'aleData', to: { name: 'aleData' } }
]
</script>

<template>
  <main class="home">
    <h1 class="home-title">页面目录</h1>
    <nav aria-label="页面目录">
      <ul class="page-list">
        <li v-for="page in pages" :key="page.to.name">
          <RouterLink class="page-link" :to="page.to">
            {{ page.title }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </main>
</template>

<style scoped>
.home {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  padding: 24px;
}

.home-title {
  margin: 0 0 24px;
  font-size: 24px;
}

.page-list {
  margin: 0;
  padding-left: 24px;
}

.page-link {
  display: inline-block;
  padding: 8px 0;
}
</style>
