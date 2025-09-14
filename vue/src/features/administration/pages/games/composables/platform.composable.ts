import * as Yup from 'yup'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useFormUtil } from '@/core/utils/forms.util'
import { PlatformDto } from '@lib/dto/platform.dto'

type proptype = {
  platform?: PlatformDto
  title: string
  callback: (values: any) => Promise<void>
}

type Platform = {
  loading: Ref<boolean>
  initialValues: ComputedRef<{
    name: string | undefined
    release_date: Date | undefined
    slug: string | undefined
  }>
  validationSchema: Yup.ObjectSchema<any>
  onSubmit: (values: Record<string, any>) => void
}

function usePlatformComposable({ platform, callback }: proptype): Platform {
  const { getSubmitFn } = useFormUtil()
  const loading = ref<boolean>(false)

  const initialValues = computed(() => ({
    name: platform?.name,
    release_date: platform?.release_date,
    slug: platform?.slug
  }))

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    release_date: Yup.date().required(),
    slug: Yup.string().required()
  })

  const onSubmit = getSubmitFn(validationSchema, async (values: object) => {
    loading.value = true
    await callback(values).finally(() => {
      loading.value = false
    })
  })

  return {
    loading,
    initialValues,
    validationSchema,
    onSubmit
  }
}

export type { Platform, proptype }
export { usePlatformComposable }
