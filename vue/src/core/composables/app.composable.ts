import { ref, provide, onMounted } from 'vue'
import { useAppStore } from '../store/app.store'

export function useApp() {
  const appStore = useAppStore()

  const UpdateKeySymbol = Symbol('updateKey')
  type UpdateKeyFn = () => void

  const renderKey = ref(Date.now())
  const updateKey: UpdateKeyFn = () => (renderKey.value = Date.now())

  provide(UpdateKeySymbol, updateKey)

  const loading = ref<boolean>(true)

  onMounted(async () => {
    loading.value = true
    await appStore
      .initialize()
      .catch((err) => console.warn(`[Auth] Err: ${err.message}`))
      .finally(() => (loading.value = false))
  })

  return { renderKey, loading }
}
