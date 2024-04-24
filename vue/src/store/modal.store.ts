import { Store, StoreDefinition, defineStore } from 'pinia'

interface Modal {
  isOpen: boolean
  options?: ModalOptions
}

type size = 'sm' | 'md' | 'lg' | 'xl'

const DefaultModal: Modal = {
  isOpen: false,
  options: {
    view: undefined,
    size: 'md',
    properties: undefined
  }
}

interface ModalOptions {
  properties?: Object | undefined
  size?: size
  view: object | undefined
}

interface ModalStoreGetters {}
interface ModalStoreActions {
  openModal(payload: ModalOptions): void
  closeModal(): void
  purgeModal(): void
}

type ModalStore = Store<'modal', Modal, ModalStoreGetters, ModalStoreActions>
type StoreDef = StoreDefinition<'modal', Modal, ModalStoreGetters, ModalStoreActions>

const useModalStore: StoreDef = defineStore({
  id: 'modal',
  state: (): Modal => DefaultModal,
  getters: {},
  actions: {
    purgeModal(): void {
      this.options = DefaultModal.options
    },
    openModal(options: ModalOptions): void {
      this.options = { ...this.options, ...options }
      this.isOpen = true
    },
    closeModal(): void {
      this.isOpen = false
    }
  }
})

export { useModalStore }
export type { ModalStore, ModalOptions }
