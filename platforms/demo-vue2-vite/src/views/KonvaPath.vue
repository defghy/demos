<template>
  <div>
    <div class="konva-path-container" ref="container"></div>
    <div class="animate-btns">
      <el-button size="mini" @click="startMovePointAnimate('linear')">f(t) = t</el-button>
      <el-button size="mini" @click="startMovePointAnimate('quad')">f(t) = t^2</el-button>
      <el-button size="mini" @click="startMovePointAnimate('cubic')">f(t) = t^3</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref } from 'vue'
import Konva from 'konva'

import { useContext } from '@demo/utils'

export default defineComponent({
  setup() {
    const container = ref()

    const start = { x: 20, y: 80 }
    const end = { x: 105, y: 200 }
    const ctr1 = { x: 50, y: 10 }
    const ctr2 = { x: 75, y: 10 }
    const printPoint = p => `${p.x} ${p.y}`

    let stage: Konva.Stage
    let path: Konva.Path
    let movePoint: Konva.Circle
    const init = function () {
      stage = new Konva.Stage({
        container: container.value,
        width: container.value.offsetWidth,
        height: container.value.offsetHeight,
      })

      const layer = new Konva.Layer()
      stage.add(layer)
      stage.scale({ x: 2, y: 2 })

      path = new Konva.Path({
        x: 0,
        y: 0,
        // data: 'M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z',
        data: `M${printPoint(start)} C ${printPoint(ctr1)}, ${printPoint(ctr2)}, ${printPoint(end)}`,
        stroke: 'green',
        strokeWidth: 2,
      })

      layer.add(path)
      layer.add(initMovePoint({ path }))
    }

    onMounted(() => {
      init()
    })

    // 初始化移动点
    const initMovePoint = function ({ path }: { path: Konva.Path }) {
      movePoint = new Konva.Circle({
        x: start.x,
        y: start.y,
        radius: 10,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
      })

      movePoint.addEventListener('pointerenter', function (evt) {
        container.value.style.cursor = 'pointer'
      })
      movePoint.addEventListener('pointerleave', function (evt) {
        container.value.style.cursor = ''
      })
      movePoint.addEventListener('click', () => startMovePointAnimate())

      return movePoint
    }

    // 动画
    const animateTypes = {
      linear: t => t,
      quad: t => t ** 2,
      cubic: t => t ** 3,
    }
    let isAnimating = false
    const startMovePointAnimate = function (type = 'linear') {
      if (isAnimating) {
        return
      }
      isAnimating = true
      movePoint.setAttrs(start)
      let startTime = Date.now()
      const duration = 3000
      const totalLen = path.getLength()
      const animateFunc = animateTypes[type]

      const animateRun = function () {
        const progress = animateFunc((Date.now() - startTime) / duration)
        if (progress > 1) {
          isAnimating = false
          return
        }

        const currPoint = path.getPointAtLength(totalLen * progress)
        currPoint && movePoint.setAttrs(currPoint)
        stage.batchDraw()

        requestAnimationFrame(animateRun)
      }
      animateRun()
    }

    return { container, startMovePointAnimate }
  },
})
</script>

<style scoped lang="less">
.konva-path-container {
  width: 600px;
  height: 600px;
  margin-left: 100px;
}
</style>
