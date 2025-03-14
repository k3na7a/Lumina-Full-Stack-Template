import { Store, StoreDefinition, defineStore } from 'pinia'

const DEFAULT_TIMEOUT = 15
type theme = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light'

interface Toast {
  id: number
  title: string
  body: string
  expire: NodeJS.Timeout
  theme: theme
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
  timeout?: number
  theme?: theme
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
        title,
        body,
        expire: setTimeout(this.removeToast, (options?.timeout || DEFAULT_TIMEOUT) * 1000, id),
        theme: options?.theme || 'primary'
      })
    },
    removeToast(id: number): void {
      const index = this.$toasts.findIndex((toast: Toast) => toast.id == id)
      if (index > -1) this.$toasts.splice(index, 1)
    }
  }
})

export { useToastStore }
export type { Toast, ToastStore, theme }
