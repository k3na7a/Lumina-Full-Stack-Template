import { reactive } from 'vue'
import * as Yup from 'yup'

import { useFormUtil } from '@/core/utils/forms.util'
import { UpdateEmail, UserDto } from '@/core/apis/localhost/administration/users/dto/user.dto'

type proptype = { user: UserDto; callback: (props: UpdateEmail) => Promise<void> }

type iUpdateEmail = {
  state: {
    loading: boolean
    open: boolean
  }
  user: UserDto
  validationSchema: Yup.ObjectSchema<any>
  onSubmit: (values: Record<string, any>) => void
}

function useUpdateEmail({ user, callback }: proptype): iUpdateEmail {
  const { getSubmitFn } = useFormUtil()

  const state = reactive<{ loading: boolean; open: boolean }>({ loading: false, open: false })

  const validationSchema = Yup.object().shape({
    password: Yup.string().required(),
    email: Yup.string().email().required(),
    confirm_email: Yup.string()
      .required()
      .oneOf([Yup.ref('email')])
  })

  const onSubmit = getSubmitFn(validationSchema, async (values: UpdateEmail): Promise<void> => {
    state.loading = true
    callback(values).finally(() => (state.loading = false))
  })

  return {
    state,
    user,
    validationSchema,
    onSubmit
  }
}

export type { iUpdateEmail, proptype }
export { useUpdateEmail }
