import { Store, StoreDefinition, defineStore } from 'pinia'

interface Offcanvas {
  isOpen: boolean
  options?: OffcanvasOptions
}

const DefaultOffcanvas: Offcanvas = {
  isOpen: false,
  options: {
    view: undefined,
    properties: undefined
  }
}

interface OffcanvasOptions {
  properties?: Object | undefined
  view: object | undefined
}

interface OffcanvasStoreGetters {}
interface OffcanvasStoreActions {
  openOffcanvas(payload: OffcanvasOptions): void
  closeOffcanvas(): void
  purgeOffcanvas(): void
}

type OffcanvasStore = Store<'offcanvas', Offcanvas, OffcanvasStoreGetters, OffcanvasStoreActions>
type StoreDef = StoreDefinition<'offcanvas', Offcanvas, OffcanvasStoreGetters, OffcanvasStoreActions>

const useOffcanvasStore: StoreDef = defineStore({
  id: 'offcanvas',
  state: (): Offcanvas => DefaultOffcanvas,
  getters: {},
  actions: {
    purgeOffcanvas(): void {
      this.options = DefaultOffcanvas.options
    },
    openOffcanvas(options: OffcanvasOptions): void {
      this.options = { ...this.options, ...options }
      this.isOpen = true
    },
    closeOffcanvas(): void {
      this.isOpen = false
    }
  }
})

export { useOffcanvasStore }
export type { OffcanvasStore, OffcanvasOptions }
