import { Palette } from '@/config/types/color.type'
import { Store, StoreDefinition, defineStore } from 'pinia'

const DEFAULT_TIMEOUT = 5

interface Toast {
  id: number
  title: string
  body: string
  type?: Palette
  timeout: number
  expire: NodeJS.Timeout
}

interface ToastState {
  $toasts: Toast[]
}

interface NewToast {
  title: string
  body: string
  options?: ToastOptions
}

interface ToastOptions {
  type?: Palette
  timeout?: number
}

interface ToastGetters {
  getToasts: (state: ToastState) => Toast[]
}

interface ToastActions {
  addToast: (newToast: NewToast) => void
  removeToast: (id: number) => void
}

type ToastStore = Store<'toast', ToastState, ToastGetters, ToastActions>
type StoreDef = StoreDefinition<'toast', ToastState, ToastGetters, ToastActions>

const useToastStore: StoreDef = defineStore({
  id: 'toast',
  state: (): ToastState => ({
    $toasts: []
  }),
  getters: {
    getToasts: (state: ToastState): Toast[] => state.$toasts
  },
  actions: {
    addToast({ title, body, options }: NewToast): void {
      const id = Date.now()

      this.$toasts.push({
        id,
        type: options?.type || 'primary',
        title,
        body,
        timeout: options?.timeout || DEFAULT_TIMEOUT,
        expire: setTimeout(this.removeToast, (options?.timeout || DEFAULT_TIMEOUT) * 1000, id)
      })
    },
    removeToast(id: number): void {
      const index = this.$toasts.findIndex((toast: Toast) => toast.id == id)
      if (index > -1) this.$toasts.splice(index, 1)
    }
  }
})

export { useToastStore }
export type { Toast, ToastStore }
