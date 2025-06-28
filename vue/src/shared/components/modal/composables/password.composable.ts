import * as Yup from 'yup'
import { Ref, ref } from 'vue'

import { useFormUtil } from '@/core/utils/forms.util'

type FormValues = { password: string }
type PasswordModal = {
  onSubmit: (values: Record<string, any>) => void
  loading: Ref<boolean>
  validationSchema: Yup.ObjectSchema<any>
}

type proptype = {
  close: () => void
  callback: (values: FormValues) => Promise<void>
  title: string
  body: string
  action: string
}

function usePasswordModal(callback: (values: FormValues) => Promise<void>): PasswordModal {
  const { getSubmitFn } = useFormUtil()

  const loading = ref<boolean>(false)
  const validationSchema = Yup.object().shape({
    password: Yup.string().required()
  })

  const onSubmit = getSubmitFn(validationSchema, (values: FormValues) => {
    loading.value = true
    callback(values).finally(() => {
      loading.value = false
    })
  })

  return {
    onSubmit,
    loading,
    validationSchema
  }
}

export type { PasswordModal, proptype }
export { usePasswordModal }
