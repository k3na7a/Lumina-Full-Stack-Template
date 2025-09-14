import * as Yup from 'yup'
import { computed, ref } from 'vue'

import { useFormUtil } from '@/core/utils/forms.util'
import { LocalhostAPI } from '@/core/apis'
import { AppStore, useAppStore } from '@/core/store/app.store'
import { PaginationOptions } from '@lib/dto/pagination.dto'
import { PermissionDto } from '@lib/dto/permission.dto'
import { RoleDto, iCreateRole } from '@lib/dto/role.dto'

type proptype = {
  role?: RoleDto
  title: string
  callback: (values: iCreateRole) => Promise<void>
}

function useRoleForm({ role, callback }: proptype) {
  const validateUtil = useFormUtil()
  const loading = ref(false)
  const { getValidAccessToken }: AppStore = useAppStore()

  const initialValues = computed(() => ({
    name: role?.name,
    label: role?.label,
    description: role?.description,
    isSystemRole: role?.isSystemRole || false,
    permissions: role?.permissions || []
  }))

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    label: Yup.string().required(),
    description: Yup.string().optional(),
    permissions: Yup.array<PermissionDto>().optional(),
    isSystemRole: Yup.boolean().required()
  })

  async function getPermissions(options: PaginationOptions) {
    const accessToken = await getValidAccessToken()
    return LocalhostAPI.administration.permissions.getPaginated(options, accessToken as string)
  }

  const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: iCreateRole) => {
    loading.value = true
    await callback?.(values)
    loading.value = false
  })

  return {
    validationSchema,
    initialValues,
    onSubmit,
    loading,
    getPermissions
  }
}

export type { proptype }
export { useRoleForm }
