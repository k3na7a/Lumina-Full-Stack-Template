import * as Yup from 'yup'
import { Ref, ref } from 'vue'

import { useFormUtil } from '@/core/utils/forms.util'

import { credentials } from '@/core/apis/localhost/dto/JWT.dto'

type proptype = { callback: (values: credentials) => Promise<void> }
type SignInModal = {
  loading: Ref<boolean>
  onSubmit: (values: Record<string, any>) => void
  validationSchema: Yup.ObjectSchema<any>
}

function useSignInModal(callback: (values: credentials) => Promise<void>): SignInModal {
  const { getSubmitFn } = useFormUtil()

  const loading = ref<boolean>(false)
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required()
  })

  const onSubmit = getSubmitFn(validationSchema, async (values: credentials) => {
    loading.value = true
    callback(values).finally(() => {
      loading.value = false
    })
  })

  return {
    loading,
    onSubmit,
    validationSchema
  }
}

export type { SignInModal, proptype }
export { useSignInModal }
