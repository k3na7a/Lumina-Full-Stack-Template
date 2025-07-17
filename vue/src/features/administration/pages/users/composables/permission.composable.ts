import * as Yup from 'yup'
import { computed, ref } from 'vue'

import { useFormUtil } from '@/core/utils/forms.util'
import { iCreatePermission, PermissionDto } from '@/library/dto/permission.dto'
import { PermissionDomain } from '@/library/constants/permissions.constants'

type proptype = {
  permission?: PermissionDto
  title: string
  callback: (values: iCreatePermission) => Promise<void>
}

function usePermissionForm({ permission, callback }: proptype) {
  const validateUtil = useFormUtil()
  const loading = ref(false)

  const initialValues = computed(() => ({
    name: permission?.name,
    label: permission?.label,
    description: permission?.description,
    domain: permission?.domain,
    isSystemPermission: permission?.isSystemPermission || false
  }))

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    label: Yup.string().required(),
    description: Yup.string().optional(),
    domain: Yup.mixed<PermissionDomain>().oneOf(Object.values(PermissionDomain)).required(),
    isSystemPermission: Yup.boolean().required()
  })

  const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: iCreatePermission) => {
    loading.value = true
    await callback?.(values)
    loading.value = false
  })

  return {
    validationSchema,
    initialValues,
    onSubmit,
    loading
  }
}

export type { proptype }
export { usePermissionForm }
