import { computed, Ref, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import * as Yup from 'yup'

import { useFormUtil } from '@/core/utils/forms.util'
import { UserDto, UpdateUser, Role } from '@/library/dto/user.dto'

type proptype = { user?: UserDto; callback: (values: UpdateUser) => Promise<void> }

function useUserComposable(props: proptype) {
  const { messages, locale } = useI18n()
  const { getSubmitFn } = useFormUtil()

  const loading = ref<boolean>(false)
  const user: Ref<UserDto | undefined> = toRef(props, 'user')

  const { callback } = props

  const currentMessages = messages.value[locale.value] as Record<string, any>
  const emailPlaceholder = currentMessages.forms.placeholders.email as string

  const initialValues = computed(() => ({
    firstname: user.value?.profile.name.first,
    lastname: user.value?.profile.name.last,
    email: user.value?.email,
    role: user.value?.role,
    avatar: undefined,
    'remove-avatar': undefined
  }))

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    firstname: Yup.string().required(),
    lastname: Yup.string().required(),
    role: Yup.mixed<Role>().oneOf(Object.values(Role)).required(),
    avatar: Yup.mixed<File>().notRequired(),
    'remove-avatar': Yup.boolean().required()
  })

  const onSubmit = getSubmitFn(validationSchema, async (values: UpdateUser) => {
    loading.value = true
    await callback(values).finally(() => {
      loading.value = false
    })
  })

  return { user, loading, onSubmit, validationSchema, initialValues, emailPlaceholder }
}

export type { proptype }
export { useUserComposable }
