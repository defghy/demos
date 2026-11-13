<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

const supported = 'drawElementImage' in CanvasRenderingContext2D.prototype
  && 'requestPaint' in HTMLCanvasElement.prototype
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const cardRef = shallowRef<HTMLElement | null>(null)
const animated = shallowRef(true)
const name = shallowRef('Hello, Canvas!')
const count = shallowRef(0)

onMounted(() => {
  const canvas = canvasRef.value
  const card = cardRef.value
  if (!canvas || !card) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // CSS 尺寸负责布局，像素尺寸匹配屏幕，避免高分屏模糊。
  const observer = new ResizeObserver(([entry]) => {
    canvas.width = entry.devicePixelContentBoxSize[0].inlineSize
    canvas.height = entry.devicePixelContentBoxSize[0].blockSize
    canvas.requestPaint()
  })
  observer.observe(canvas, { box: 'device-pixel-content-box' })

  const paint = () => {
    const t = animated.value ? performance.now() / 1000 : 0
    const width = card.offsetWidth
    const height = card.offsetHeight
    const scale = Math.min(1, (canvas.clientWidth - 96) / width,
      (canvas.clientHeight - 96) / height)
    // 每帧重置坐标系，避免上一帧的缩放、旋转累积。
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 匹配高分屏像素比例，后面的坐标和尺寸继续使用 CSS 像素。
    ctx.scale(canvas.width / canvas.clientWidth, canvas.height / canvas.clientHeight)
    // 将原点移到画布中心，作为卡片旋转、缩放的中心。
    ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2)
    // 随时间左右摇摆，旋转角度约为 ±2.6°。
    ctx.rotate(Math.sin(t * 1.5) * 0.045)
    // 整体缩放以适应画布，水平方向额外往复伸缩 ±2.5%。
    ctx.scale(scale * (1 + Math.sin(t * 2) * 0.025), scale)
    // 卡片按左上角 (0, 0) 绘制：偏移半宽半高，使卡片中心对准变换中心。
    // 对卡片上的点，变换顺序为：减去半宽半高 → 伸缩 → 旋转 → 居中 → 像素比例换算。
    ctx.translate(-width / 2, -height / 2)

    // 像绘制 Sprite 一样，把同一份 HTML 绘制成半透明残影。
    // 残影只负责视觉，不能覆盖真实卡片的点击区域。
    for (let i = 3; i > 0 && animated.value; i--) {
      ctx.globalAlpha = 0.09
      ctx.drawElementImage(card, Math.sin(t * 2 - i * 0.4) * i * 14, i * 8, width, height,
        { preserveElementGeometry: true })
    }

    ctx.globalAlpha = 1
    ctx.shadowColor = '#8b5cf6'
    ctx.shadowBlur = animated.value ? 24 : 0
    // 主卡片最后绘制，浏览器自动同步变换后的输入、点击及无障碍坐标。
    // 显式传 CSS 宽高：默认图像尺寸已经包含像素比例，不能再次随 ctx.scale 放大。
    ctx.drawElementImage(card, 0, 0, width, height)
    ctx.shadowBlur = 0
    if (animated.value) canvas.requestPaint()
  }

  // DOM 改变时浏览器触发 paint；纯特效动画用 requestPaint 主动请求下一帧。
  canvas.addEventListener('paint', paint)
  canvas.requestPaint()
  onBeforeUnmount(() => {
    observer.disconnect()
    canvas.removeEventListener('paint', paint)
  })
})

watch(animated, () => canvasRef.value?.requestPaint())
</script>

<template>
  <main class="demo">
    <h1 class="title">HTML in Canvas</h1>
    <p class="intro">HTML 负责排版与交互，Canvas 负责摇摆、发光和残影。</p>
    <label v-if="supported" class="toggle">
      <input v-model="animated" type="checkbox" /> 开启特效（关闭后方便编辑）
    </label>
    <canvas v-if="supported" ref="canvasRef" class="stage" content="drawable">
      <article ref="cardRef" class="html-card" drawable="">
        <span class="badge">LIVE DOM → CANVAS</span>
        <h2 class="card-title">{{ name }}</h2>
        <p class="card-text">这张卡片是真实 HTML，试试输入和点击。</p>
        <label class="field">
          卡片标题
          <input v-model="name" class="text-input" maxlength="32" />
        </label>
        <button class="action" type="button" @click="count++">点击了 {{ count }} 次</button>
      </article>
    </canvas>
    <p v-else class="unsupported" role="status">
      当前浏览器未提供 drawElementImage / requestPaint，请使用支持 HTML-in-Canvas 的 Chrome。
    </p>
    <p class="principle">
      content="drawable" → HTML 子树排版 → paint → drawElementImage → Canvas 特效
    </p>
    <a class="doc-link" href="https://developer.chrome.com/docs/web-platform/html-in-canvas/2d"
      target="_blank" rel="noreferrer">查看 API 文档 ↗</a>
  </main>
</template>

<style scoped>
.demo { box-sizing: border-box; height: 100%; overflow: auto; padding: 32px 16px; text-align: center; color: #ede9fe; background: #100d1e; }
.title { margin: 0 0 12px; font-size: clamp(28px, 6vw, 42px); }
.intro, .principle { color: #b7afcd; }
.toggle { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; }
.stage { display: block; width: min(720px, 100%); height: 440px; margin: 16px auto; border-radius: 20px; background: radial-gradient(ellipse, #2c1e49, #161124 70%); }
.html-card { box-sizing: border-box; width: 320px; padding: 28px; text-align: left; color: #f5f3ff; background: #25203d; border: 1px solid #a78bfa; border-radius: 20px; font: 15px/1.5 system-ui, sans-serif; }
.badge { color: #c4b5fd; font-size: 11px; letter-spacing: 2px; }
.card-title { margin: 16px 0 8px; font-size: 26px; line-height: 1.2; overflow-wrap: anywhere; }
.card-text { color: #c6bfd8; font-size: 14px; }
.field { display: grid; gap: 8px; font-size: 13px; }
.text-input { box-sizing: border-box; width: 100%; padding: 10px; color: #fff; background: #151122; border: 1px solid #71638c; border-radius: 8px; font: inherit; }
.action { width: 100%; margin-top: 16px; color: #fff; background: #7c3aed; }
.principle { margin: 16px auto; font-size: 13px; overflow-wrap: anywhere; }
.doc-link { color: #c4b5fd; font-size: 14px; }
.unsupported { margin: 80px auto; max-width: 520px; }
</style>
