import { getCurrentInstance, default as Vue } from 'vue'
import { NavigationGuard } from 'vue-router'
import { useRoute } from 'vue-router/composables'

export const useContext = function () {
  const { $router, $createElement, $slots, $scopedSlots } = getCurrentInstance()?.proxy as Vue

  // router
  const pushGuard = function (key: string, func: Function, options: any) {
    options[key] = options[key] || []
    if (!options[key].includes(func)) {
      options[key].push(func)
    }
  }
  const onBeforeRouteLeave = function (func: NavigationGuard) {
    const ctx = getCurrentInstance()?.proxy

    const options = (ctx?.constructor as any).options as any
    pushGuard('beforeRouteLeave', func, options)
  }
  const onBeforeRouteUpdate = function (func: NavigationGuard) {
    const ctx = getCurrentInstance()?.proxy

    const options = (ctx?.constructor as any).options as any
    pushGuard('onBeforeRouteUpdate', func, options)
  }
  const $el = function () {
    return getCurrentInstance()?.proxy.$el
  }

  return {
    $router,
    $route: useRoute(),
    onBeforeRouteLeave,
    onBeforeRouteUpdate,
    h: $createElement,
    $slots,
    $scopedSlots,
    $el,
  }
}
