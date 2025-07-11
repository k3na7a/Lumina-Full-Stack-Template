import { ref, provide } from 'vue'

export function useApp() {
  const UpdateKeySymbol = Symbol('updateKey')
  type UpdateKeyFn = () => void

  const renderKey = ref(Date.now())
  const updateKey: UpdateKeyFn = () => (renderKey.value = Date.now())

  provide(UpdateKeySymbol, updateKey)

  return { renderKey }
}
