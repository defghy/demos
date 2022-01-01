import { ElMessage, ElMessageBox } from 'element-plus';

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $message: typeof ElMessage;
        $confirm: typeof ElMessageBox.confirm;
    }
}
