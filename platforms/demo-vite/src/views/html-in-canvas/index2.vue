<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { Application, Rectangle, Sprite, Texture } from 'pixi.js'
import { HTMLSource } from 'pixi.js/html-source'

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const cardRef = shallowRef<HTMLElement | null>(null)
const title = shallowRef('HTML → 纹理 → 小块')
const expanded = shallowRef(false)
const error = shallowRef('')
const supported =
  'requestPaint' in HTMLCanvasElement.prototype && 'updateElementGeometry' in HTMLCanvasElement.prototype
let disposed = false
let cleanup = () => {}
onBeforeUnmount(() => {
  disposed = true
  cleanup()
})

onMounted(async () => {
  const canvas = canvasRef.value
  const card = cardRef.value
  if (!canvas || !card) return
  const app = new Application()
  let ready = false
  let source: HTMLSource | undefined
  let observer: ResizeObserver | undefined
  cleanup = () => {
    observer?.disconnect()
    if (ready) app.destroy(false, { children: true, texture: true })
    ready = false
    source?.destroy()
    source = undefined
  }
  try {
    await app.init({
      canvas,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      preference: 'webgl',
      background: '#121827',
      resolution: devicePixelRatio,
      autoStart: false,
    })
    ready = true
    if (disposed) {
      cleanup()
      return
    }
    app.stage.eventMode = 'none' // 点击和输入交给真实 DOM。

    // 一份真实 DOM → 一张实时纹理来源 → 多个 Sprite 各取其中一块。
    source = new HTMLSource({ resource: card })
    const size = 40
    const width = card.offsetWidth,
      height = card.offsetHeight
    const cols = Math.ceil(width / size),
      rows = Math.ceil(height / size)
    const tiles: Sprite[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * size,
          y = row * size
        const texture = new Texture({
          source,
          frame: new Rectangle(x, y, Math.min(size, width - x), Math.min(size, height - y)),
        })
        const sprite = new Sprite(texture)
        app.stage.addChild(sprite)
        tiles.push(sprite)
      }
    }

    let gap = 0
    app.ticker.add(({ deltaTime }) => {
      const target = expanded.value ? 4 : 0 // 展开后，相邻小块间距为 4 个 CSS 像素。
      gap += (target - gap) * Math.min(1, deltaTime * 0.2)
      if (Math.abs(target - gap) < 0.01) gap = target
      const scale = Math.min(1, Math.max(0.1, (app.screen.width - 64) / width))
      const x = (app.screen.width - width * scale) / 2
      const y = (app.screen.height - height * scale) / 2
      tiles.forEach((tile, index) => {
        const col = index % cols,
          row = Math.floor(index / cols)
        tile.scale.set(scale)
        tile.position.set(
          x + col * size * scale + (col - (cols - 1) / 2) * gap,
          y + row * size * scale + (row - (rows - 1) / 2) * gap
        )
      })
      // DOM 始终是完整矩形，命中区域不随碎块扩散；只让绘制的像素分开。
      canvas.updateElementGeometry(card, { canvasTransform: new DOMMatrix().translate(x, y).scale(scale) })
      source?.requestPaint() // 按钮文字、输入内容、hover 等状态实时进入所有小块。
    })
    observer = new ResizeObserver(() => app.renderer.resize(canvas.clientWidth, canvas.clientHeight))
    observer.observe(canvas)
    app.start()
  } catch (cause) {
    cleanup()
    if (!disposed) error.value = String(cause)
  }
})
</script>

<template>
  <main class="demo">
    <p>点击卡片按钮：小块展开 / 拼回，真实 DOM 始终保持完整。</p>
    <canvas v-if="supported && !error" ref="canvasRef" class="stage" content="drawable">
      <!-- 只有这一份内容 DOM：保持正常样式，不要设 opacity: 0，否则纹理也会透明。 -->
      <article ref="cardRef" class="source-card" drawable="">
        <h2 class="card-title">{{ title }}</h2>
        <p class="card-text">画面可以碎开，DOM 仍然可以输入、点击和选择文字。</p>
        <input v-model="title" class="text-input" aria-label="卡片标题" maxlength="24" />
        <button class="action" type="button" @click="expanded = !expanded">
          {{ expanded ? '拼回完整页面' : '展开所有小块' }}
        </button>
      </article>
    </canvas>
    <p v-else role="status">
      {{ error || '需要支持 HTML-in-Canvas 的 Chrome；实验版本请开启 chrome://flags/#canvas-draw-element。' }}
    </p>
  </main>
</template>

<style scoped>
.demo {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  padding: 24px 16px;
  text-align: center;
  color: #cbd5e1;
  background: #0b1020;
}
.stage {
  display: block;
  width: min(640px, 100%);
  height: 360px;
  margin: 24px auto;
  border-radius: 12px;
  touch-action: auto;
}
.source-card {
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  display: grid;
  align-content: center;
  gap: 12px;
  width: 320px;
  height: 240px;
  padding: 20px;
  border: 1px solid #67e8f9;
  border-radius: 12px;
  background: #1e293b;
  color: #f1f5f9;
  font:
    14px/1.5 system-ui,
    sans-serif;
  text-align: left;
  user-select: text;
}
.card-title {
  margin: 0;
  overflow: hidden;
  font-size: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.card-text {
  margin: 0;
}
.text-input {
  box-sizing: border-box;
  width: 100%;
  padding: 8px;
  border: 1px solid #64748b;
  border-radius: 6px;
  background: #0f172a;
  color: #fff;
  font: inherit;
}
.action {
  background: #0891b2;
  color: #fff;
}
.action:hover {
  background: #0e7490;
  border-color: #67e8f9;
}
</style>
