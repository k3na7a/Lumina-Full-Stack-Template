import { computed, Ref, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import * as Yup from 'yup'

import { useFormUtil } from '@/shared/utils/forms.util'
import { UserDto, UpdateUser } from '@lib/dto/user.dto'
import { LocalhostAPI } from '@/core/apis'
import { AppStore, useAppStore } from '@/core/store/app.store'
import { PaginationOptions } from '@lib/dto/pagination.dto'
import { RoleDto } from '@lib/dto/role.dto'

type proptype = { user?: UserDto; callback: (values: UpdateUser) => Promise<void> }

function useUserComposable(props: proptype) {
  const { messages, locale } = useI18n()
  const { getSubmitFn } = useFormUtil()
  const { getValidAccessToken }: AppStore = useAppStore()

  const loading = ref<boolean>(false)
  const user: Ref<UserDto | undefined> = toRef(props, 'user')

  const { callback } = props

  const currentMessages = messages.value[locale.value] as Record<string, any>
  const emailPlaceholder = currentMessages.forms.placeholders.email as string

  const initialValues = computed(() => ({
    firstname: user.value?.profile.name.first,
    lastname: user.value?.profile.name.last,
    email: user.value?.email,
    roles: user.value?.roles || [],
    avatar: undefined,
    'remove-avatar': false
  }))

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    firstname: Yup.string().required(),
    lastname: Yup.string().required(),
    roles: Yup.array<RoleDto>().optional(),
    avatar: Yup.mixed<File>().notRequired(),
    'remove-avatar': Yup.boolean().required()
  })

  async function getRoles(options: PaginationOptions) {
    const accessToken = await getValidAccessToken()
    return LocalhostAPI.administration.roles.getPaginated(options, accessToken as string)
  }

  const onSubmit = getSubmitFn(validationSchema, async (values: UpdateUser) => {
    loading.value = true
    await callback(values).finally(() => {
      loading.value = false
    })
  })

  return { user, loading, onSubmit, validationSchema, initialValues, emailPlaceholder, getRoles }
}

export type { proptype }
export { useUserComposable }
