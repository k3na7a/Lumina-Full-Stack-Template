import * as Yup from 'yup'

type FormValues = { password: string }
const validationSchema = Yup.object().shape({
  password: Yup.string().required()
})

export { validationSchema }
export type { FormValues }
