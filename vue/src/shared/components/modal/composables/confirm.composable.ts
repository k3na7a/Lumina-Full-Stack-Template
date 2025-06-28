import { Ref, ref } from 'vue'

type proptype = {
  close: () => void
  callback: () => Promise<void>
  title: string
  body: string
  action: string
}

type ConfirmModal = {
  loading: Ref<boolean>
  onSubmit: () => void
}

function useConfimModal(callback: () => Promise<void>): ConfirmModal {
  const loading = ref<boolean>(false)

  const onSubmit = (): void => {
    loading.value = true
    callback().finally(() => {
      loading.value = false
    })
  }

  return { loading, onSubmit }
}

export type { ConfirmModal, proptype }
export { useConfimModal }
