import * as Yup from 'yup'
import { ref } from 'vue'

import { useFormUtil } from '@/shared/utils/forms.util'
import { PasswordValidation } from '@lib/regex/validation.regex'

type proptype = { callback: (values: any) => Promise<void> }

type registrationValues = { firstname: string; lastname: string; email: string; password: string }

function useRegisterModal(callback: (values: registrationValues) => Promise<void>) {
  const { getSubmitFn } = useFormUtil()

  const loading = ref<boolean>(false)

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required(),
    lastname: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required().matches(PasswordValidation.regex)
  })

  const onSubmit = getSubmitFn(validationSchema, async (values: registrationValues) => {
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

export type { proptype }
export { useRegisterModal }
