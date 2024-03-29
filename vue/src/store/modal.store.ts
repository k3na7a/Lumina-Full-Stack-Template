import { Store, StoreDefinition, defineStore } from 'pinia'

import { Palette } from '@/config/types/color.type'

interface Modal {
  isOpen: boolean
  options?: ModalOptions
}

type size = 'sm' | 'lg' | 'xl'

const DefaultModal: Modal = {
  isOpen: false,
  options: {
    title: undefined,
    view: undefined,
    actions: [],
    size: 'sm',
    properties: undefined
  }
}

interface ModalOptions {
  title: string | undefined
  properties?: Object | undefined
  size?: size
  view: object | undefined
  actions?: ModalAction[]
}

interface ModalAction {
  label: string
  type: Palette
  callback: (props?: any) => Promise<void>
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
      this.options = options
      this.isOpen = true
    },
    closeModal(): void {
      this.isOpen = false
    }
  }
})

export { useModalStore }
export type { ModalStore, ModalOptions, ModalAction }
