import * as Yup from 'yup'

import { UserDto, UpdatePassword } from '@/library/dto/user.dto'
import { PasswordValidation } from '@/library/regex/validation.regex'
import { useFormUtil } from '@/core/utils/forms.util'
import { reactive } from 'vue'

type proptype = { user: UserDto; callback: (props: UpdatePassword) => Promise<void> }

type iUpdatePassword = {
  validationSchema: Yup.ObjectSchema<any>
  onSubmit: (values: Record<string, any>) => void
  state: {
    loading: boolean
    open: boolean
  }
}

function useUpdatePassword(callback: (props: UpdatePassword) => Promise<void>): iUpdatePassword {
  const { getSubmitFn } = useFormUtil()

  const state = reactive<{ loading: boolean; open: boolean }>({ loading: false, open: false })

  const validationSchema = Yup.object().shape({
    current_password: Yup.string().required(),
    password: Yup.string().required().matches(PasswordValidation.regex),
    confirm_password: Yup.string()
      .required()
      .oneOf([Yup.ref('password')])
  })

  const onSubmit = getSubmitFn(validationSchema, async (values: UpdatePassword) => {
    state.loading = true
    callback(values).finally(() => (state.loading = false))
  })

  return { validationSchema, onSubmit, state }
}

export type { iUpdatePassword, proptype }
export { useUpdatePassword }
