# HTML-in-Canvas 最小特效示例

启动 `pnpm --filter @demo/vite vite`，访问 `/html-in-canvas`，首页也有入口。

单个 `index.vue`，不依赖 PixiJS 或截图工具。用 Canvas 2D 模拟 Sprite 的摇摆、发光、残影，同时保留 HTML 输入框和按钮交互。

类型声明由开发依赖 `@types/dom-html-in-canvas` 提供，通过 `tsconfig.json` 的 `compilerOptions.types` 加载，无需手写扩展类型。

1. `<canvas content="drawable">` 让浏览器对画布内的 HTML 进行排版。
2. `<article drawable>` 将卡片标记为可绘制子树。
3. 在 `paint` 事件中调用 `ctx.drawElementImage(card, x, y)`，绘制最新 HTML。
4. 使用 `rotate`、`scale`、`globalAlpha`、`shadowBlur` 添加特效。
5. 调用 `canvas.requestPaint()` 驱动动画；输入、点击引起 DOM 变化时，浏览器也会触发 `paint`。

2D 主卡片绘制会自动同步变换后的交互坐标。残影使用 `preserveElementGeometry: true`，避免重复绘制覆盖交互位置。这里保持整个卡片的仿射变换，便于同时演示视觉效果与准确交互；逐像素扭曲则需要 WebGL/WebGPU 着色器。

通过 API 能力检测判断支持情况，不依赖浏览器版本字符串。不支持时显示提示，不使用截图方式替代原生 API。

- [参考文章](https://mp.weixin.qq.com/s/DsTi-RsFqLCj8MlI-1aJAg)
- [Chrome 官方 2D API 文档](https://developer.chrome.com/docs/web-platform/html-in-canvas/2d)
