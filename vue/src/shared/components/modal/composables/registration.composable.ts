import * as Yup from 'yup'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFormUtil } from '@/core/utils/forms.util'

import { PasswordValidation } from '@/library/regex/validation.regex'

type proptype = { callback: (values: any) => Promise<void> }

type registrationValues = { firstname: string; lastname: string; email: string; password: string }

function useRegisterModal(callback: (values: registrationValues) => Promise<void>) {
  const { getSubmitFn } = useFormUtil()
  const { messages, locale } = useI18n()

  const loading = ref<boolean>(false)

  const currentMessages = messages.value[locale.value] as Record<string, any>
  const emailPlaceholder = currentMessages.administration.users['user-table'].update.placeholders.email as string

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
    validationSchema,
    emailPlaceholder
  }
}

export type { proptype }
export { useRegisterModal }
