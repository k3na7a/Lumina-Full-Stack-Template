import * as Yup from 'yup'

type FormValues = { image: File }
const validationSchema = Yup.object().shape({
  image: Yup.mixed<File>().required()
})

export { validationSchema }
export type { FormValues }
