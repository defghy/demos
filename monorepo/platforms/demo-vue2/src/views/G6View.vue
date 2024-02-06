<template>
  <div class="g6-wrapper">
    <div id="container"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType, defineComponent, reactive, ref, toRefs, watch, provide, inject, computed, onMounted } from '@vue/composition-api';
import G6 from '@antv/g6';

import { useRootActions, useRootState } from '@/store';

// mocked data
const mockData = {
  id: 'g1',
  name: 'Name1',
  count: 123456,
  label: '538.90',
  currency: 'Yuan',
  rate: 1.0,
  status: 'B',
  variableName: 'V1',
  variableValue: 0.341,
  variableUp: false,
  children: [
    {
      id: 'g12',
      name: 'Deal with LONG label LONG label LONG label LONG label',
      count: 123456,
      label: '338.00',
      rate: 0.627,
      status: 'R',
      currency: 'Yuan',
      variableName: 'V2',
      variableValue: 0.179,
      variableUp: true,
    },
  ],
};

const colors = {
  B: '#5B8FF9',
  R: '#F46649',
  Y: '#EEBC20',
  G: '#5BD8A6',
  DI: '#A7A7A7',
};

//  组件props
const props = {
  data: mockData,
  config: {
    padding: [20, 50],
    defaultLevel: 3,
    defaultZoom: 0.8,
    modes: { default: ['zoom-canvas', 'drag-canvas'] },
  },
};

// 自定义节点、边
const registerFn = () => {
  /**
   * 自定义节点
   */
  G6.registerNode(
    'flow-rect',
    {
      shapeType: 'flow-rect',
      draw(cfg, group) {
        const {
          name = '',
          variableName,
          variableValue,
          variableUp,
          label,
          collapsed,
          currency,
          status,
          rate
        } = cfg;

        const grey = '#CED4D9';
        const rectConfig = {
          width: 202,
          height: 60,
          lineWidth: 1,
          fontSize: 12,
          fill: '#fff',
          radius: 4,
          stroke: grey,
          opacity: 1,
        };

        const nodeOrigin = {
          x: -rectConfig.width / 2,
          y: -rectConfig.height / 2,
        };

        const textConfig = {
          textAlign: 'left',
          textBaseline: 'bottom',
        };


        // collapse rect
        if (cfg.children && cfg.children.length) {
          group.addShape('rect', {
            attrs: {
              x: rectConfig.width / 2 - 8,
              y: -8,
              width: 32,
              height: 16,
              stroke: 'rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
              fill: '#fff',
              opacity: '0.3'
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'collapse-back',
            modelId: cfg.id,
          });

          // collpase text
          group.addShape('text', {
            attrs: {
              x: rectConfig.width / 2,
              y: -1,
              textAlign: 'center',
              textBaseline: 'middle',
              text: collapsed ? '' : '',
              fontSize: 16,
              cursor: 'pointer',
              fill: 'rgba(0, 0, 0, 0.25)',
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'collapse-text',
            modelId: cfg.id,
          });
        }

        return rect;
      },
      afterDraw(cfg, group) {
        if (cfg.children?.length) {
          group?.getBBox()
        }
      },

      setState(name, value, item) {
        if (name === 'collapse') {
          const group = item.getContainer();
          const collapseText = group.find((e) => e.get('name') === 'collapse-text');
          if (collapseText) {
            if (!value) {
              collapseText.attr({
                text: '-',
              });
            } else {
              collapseText.attr({
                text: '+',
              });
            }
          }
        }
      },
      getAnchorPoints() {
        return [
          [0, 0.5],
          [1, 0.5],
        ];
      },
    },
    'rect',
  );

  G6.registerEdge('line-arrow', {
  options: {
    style: {
      stroke: '#ccc',
    },
  },
  draw: function draw(cfg, group) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;

    const stroke = (cfg.style && cfg.style.stroke) || this.options.style.stroke;
    const startArrow = (cfg.style && cfg.style.startArrow) || undefined;
    const endArrow = (cfg.style && cfg.style.endArrow) || undefined;

    const keyShape = group.addShape('path', {
      attrs: {
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y],
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y],
          ['L', endPoint.x, endPoint.y],
        ],
        stroke,
        lineWidth: 1,
        startArrow,
        endArrow,
      },
      className: 'edge-shape',
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'edge-shape',
    });
    return keyShape;
  },
});
};

registerFn();

const { data } = props;
let graph = null;

const initGraph = (data) => {
  const container = document.getElementById('container');
const width = container.scrollWidth;
const height = container.scrollHeight || 500;

// 默认配置
const defaultConfig = {
  width,
  height,
  modes: {
    default: ['zoom-canvas', 'drag-canvas'],
  },
  fitView: true,
  animate: true,
  defaultNode: {
    type: 'flow-rect',
  },
  defaultEdge: {
    type: 'line-arrow',
    style: {
      stroke: '#000',
    },
  },
  layout: {
    type: 'indented',
    direction: 'LR',
    dropCap: false,
    indent: 300,
    getHeight: () => {
      return 60;
    },
  },
};

  if (!data) {
    return;
  }
  const { onInit, config } = props;
  graph = new G6.TreeGraph({
    container: 'container',
    ...defaultConfig,
    ...config,
  });
  if (typeof onInit === 'function') {
    onInit(graph);
  }
  graph.data(data);
  graph.render();

  const handleCollapse = (e) => {
    const target = e.target;
    const id = target.get('modelId');
    const item = graph.findById(id);
    const nodeModel = item.getModel();
    nodeModel.collapsed = !nodeModel.collapsed;
    graph.layout();
    graph.setItemState(item, 'collapse', nodeModel.collapsed);
  };
  graph.on('collapse-text:click', (e) => {
    handleCollapse(e);
  });
  graph.on('collapse-back:click', (e) => {
    handleCollapse(e);
  });

  // 监听画布缩放，缩小到一定程度，节点显示缩略样式
  let currentLevel = 1;
  const briefZoomThreshold = Math.max(graph.getZoom(), 0.5);
  graph.on('viewportchange', e => {
    if (e.action !== 'zoom') return;
    const currentZoom = graph.getZoom();
    let toLevel = currentLevel;
    if (currentZoom < briefZoomThreshold) {
      toLevel = 0;
    } else {
      toLevel = 1;
    }
    if (toLevel !== currentLevel) {
      currentLevel = toLevel;
      graph.getNodes().forEach(node => {
        graph.updateItem(node, {
          level: toLevel
        })
      })
    }
  });
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
          initGraph(data);

          window.graph = graph;
        });

        return {
            ...toRefs(state),
        };
    },
});
</script>
<style scoped>

</style>
