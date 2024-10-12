import { markRaw } from 'vue'
import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { ToastStore, useToastStore } from '@/app/store/toast.store'
import CreatePlatformModal from '../components/modals/create-platform.modal.vue'

class PlatformService {
  public static createPlatform(): void {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(CreatePlatformModal),
      properties: {
        callback: async () => {
          console.log('BOOP')
        }
      }
    })
  }
}

class GameLibraryService {
  public static platforms = PlatformService
}

export { GameLibraryService }
