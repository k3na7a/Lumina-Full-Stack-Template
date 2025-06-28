import { Ref, ref } from 'vue'
import * as Yup from 'yup'

import { useFormUtil } from '@/core/utils/forms.util'
import { UpdateProfile, UserDto } from '@/library/dto/user.dto'

type proptype = { user: UserDto; callback: (props: UpdateProfile) => Promise<void> }

type iUpdateProfile = {
  validationSchema: Yup.ObjectSchema<any>
  loading: Ref<boolean>
  onSubmit: (values: Record<string, any>) => void
}

function useUpdateProfile(callback: (props: UpdateProfile) => Promise<void>): iUpdateProfile {
  const validateUtil = useFormUtil()

  const loading = ref<boolean>(false)

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required(),
    lastname: Yup.string().required()
  })

  const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: UpdateProfile) => {
    loading.value = true
    callback(values).finally(() => (loading.value = false))
  })

  return { validationSchema, loading, onSubmit }
}

export type { iUpdateProfile, proptype }
export { useUpdateProfile }
