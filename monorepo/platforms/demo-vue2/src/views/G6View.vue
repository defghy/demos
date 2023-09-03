<template>
  <div class="g6-wrapper">
    <div id="mountNode"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType, defineComponent, reactive, ref, toRefs, watch, provide, inject, computed, onMounted } from '@vue/composition-api';
import g6 from '@antv/g6';

import { useRootActions, useRootState } from '@/store';

g6.registerBehavior('test-behavior', {
    getEvents() {
      return {
        'canvas:mouseenter': 'onCanvasMouseenter',
        mousemove: 'onMouseMove',
        mouseup: 'onCanvasMouseUp',
      }
    },
    onCanvasMouseenter(event: MouseEvent) {
      console.log('enter', event);
    },
    async onCanvasMouseUp(event: MouseEvent) {
      console.log('mouseup', event);
    },
    onMouseMove(event: MouseEvent) {
      // console.log('move', event);
    },
  });

const data = {
  nodes: [
    {
      id: '0',
      label: '0',
    },
    {
      id: '1',
      label: '1',
    },
    {
      id: '2',
      label: '2',
    },
    {
      id: '3',
      label: '3',
    },
    {
      id: '4',
      label: '4',
      comboId: 'A',
    },
    {
      id: '5',
      label: '5',
      comboId: 'B',
    },
    {
      id: '6',
      label: '6',
      comboId: 'A',
    },
    {
      id: '7',
      label: '7',
      comboId: 'C',
    },
    {
      id: '8',
      label: '8',
      comboId: 'C',
    },
    {
      id: '9',
      label: '9',
      comboId: 'A',
    },
    {
      id: '10',
      label: '10',
      comboId: 'B',
    },
    {
      id: '11',
      label: '11',
      comboId: 'B',
    },
  ],
  edges: [
    {
      source: '0',
      target: '1',
    },
    {
      source: '0',
      target: '2',
    },
    {
      source: '1',
      target: '4',
    },
    {
      source: '0',
      target: '3',
    },
    {
      source: '3',
      target: '4',
    },
    {
      source: '2',
      target: '5',
    },
    {
      source: '1',
      target: '6',
    },
    {
      source: '1',
      target: '7',
    },
    {
      source: '3',
      target: '8',
    },
    {
      source: '3',
      target: '9',
    },
    {
      source: '5',
      target: '10',
    },
    {
      source: '5',
      target: '11',
    },
  ],
  combos: [
    {
      id: 'A',
      label: 'combo A',
      style: {
        fill: '#C4E3B2',
        stroke: '#C4E3B2',
      },
      anchorPoints: [0, 0],
    },
    {
      id: 'B',
      label: 'combo B',
      style: {
        stroke: '#99C0ED',
        fill: '#99C0ED',
      },
    },
    {
      id: 'C',
      label: 'combo C',
      type: 'rect',
      style: {
        stroke: '#eee',
        fill: '#eee',
      },
      "anchorPoints": [
        [0, 0],
          [ 0, 0.5 ],
          [ 1, 0 ],
          [ 1, 1]
      ],
    },
  ],
};

export default defineComponent({
    name: 'G6Test',
    components: {
      
    },
    props: {},
    setup() {
        const state = reactive({
            form: {
                count: 0,
            },
        });

        onMounted(() => {
          const graph = new g6.Graph({
            container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
            width: 800, // Number，必须，图的宽度
            height: 500, // Number，必须，图的高度
            modes: {
              default: [
                'drag-canvas',
                {
                  type: 'test-behavior',
                },
              ],
            },
            fitView: true,
          });

          graph.data(data); // 读取 Step 2 中的数据源到图上
          graph.render(); // 渲染图

          graph.on('mouseup', function(e) {
            console.log(e);
          });

          window.graph = graph;
        });

        return {
            ...toRefs(state),
        };
    },
});
</script>
<style scoped>
#mountNode {
  background-color: #eee;
}
</style>
