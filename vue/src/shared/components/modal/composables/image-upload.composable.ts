import * as Yup from 'yup'
import { Ref, ref } from 'vue'

import { useFormUtil } from '@/shared/utils/forms.util'

type proptype = {
  callback: (values: FormValues) => Promise<void>
  title: string
  action: string
}

type FormValues = { image: File }
type ImageUploadModal = {
  loading: Ref<boolean>
  validationSchema: Yup.ObjectSchema<any>
  onSubmit: (values: Record<string, any>) => void
}
function useImageUploadModal(callback: (values: FormValues) => Promise<void>): ImageUploadModal {
  const { getSubmitFn } = useFormUtil()
  const loading = ref<boolean>(false)

  const validationSchema = Yup.object().shape({
    image: Yup.mixed<File>().required()
  })

  const onSubmit = getSubmitFn(validationSchema, (values: FormValues) => {
    loading.value = true
    callback(values).finally(() => (loading.value = false))
  })

  return {
    loading,
    validationSchema,
    onSubmit
  }
}

export type { ImageUploadModal, proptype }
export { useImageUploadModal }
