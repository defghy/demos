<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql } from '@codemirror/lang-sql'
import { autocompletion } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import { lintGutter } from '@codemirror/lint'

const editor = ref<HTMLElement>(null as any)

// 自定义提示词
const customSQLCompletion = context => {
  let word = context.matchBefore(/\w*/)
  if (word.from === word.to && !context.explicit) return null

  const pos = context.pos
  const tree = syntaxTree(context.state) // 获取语法树
  const node = tree.resolve(pos, -1) // 解析游标位置的语法节点
  console.log(node, node.name)

  return {
    from: word.from,
    to: word.to,
    options: [
      { label: 'SELECT', type: 'keyword' },
      { label: 'FROM', type: 'keyword' },
      { label: 'WHERE', type: 'keyword' },
      { label: 'INSERT', type: 'keyword' },
      { label: 'DELETE', type: 'keyword' },
      { label: 'UPDATE', type: 'keyword' },
    ],
  }
}

// 初始化编辑器
onMounted(() => {
  const editorInst = new EditorView({
    state: EditorState.create({
      extensions: [
        basicSetup, // 基础设置
        sql(), // SQL 语言支持
        autocompletion({ override: [customSQLCompletion] }), // 自定义提示
        lintGutter(), // 语法检查
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            // 获取语法树
            const tree = syntaxTree(update.state)
          }
        }),
      ],
    }),
    parent: editor.value,
  })
})
</script>

<template>
  <div class="editor" ref="editor"></div>
</template>

<style>
.jsons {
  display: flex;
  width: 100%;
  height: 100%;
  .json-wrapper {
    flex: 1;
    overflow: auto;
    height: 100%;
  }
}
</style>
