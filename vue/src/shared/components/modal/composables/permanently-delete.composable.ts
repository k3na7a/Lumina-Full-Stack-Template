import * as Yup from 'yup'
import { Ref, ref } from 'vue'

import { useFormUtil } from '@/core/utils/forms.util'

type proptype = {
  close: () => void
  callback: () => Promise<void>
  title: string
  action: string
}

type PermanentlyDeleteModal = {
  loading: Ref<boolean>
  validationSchema: Yup.ObjectSchema<any>
  onSubmit: (values: Record<string, any>) => void
  $string: string
}

type FormValues = { 'permanently-delete': string }

function usePermanentlyDeleteModal(callback: () => Promise<void>): PermanentlyDeleteModal {
  const { getSubmitFn } = useFormUtil()

  const $string = 'permanently delete'

  const loading = ref<boolean>(false)
  const validationSchema = Yup.object().shape({
    'permanently-delete': Yup.string()
      .required('Confirmation is required')
      .oneOf([$string], 'You must type "permanently delete" exactly to confirm')
  })

  const onSubmit = getSubmitFn(validationSchema, (_: FormValues) => {
    loading.value = true
    callback().finally(() => {
      loading.value = false
    })
  })

  return {
    loading,
    validationSchema,
    onSubmit,
    $string
  }
}

export type { PermanentlyDeleteModal, proptype }
export { usePermanentlyDeleteModal }
