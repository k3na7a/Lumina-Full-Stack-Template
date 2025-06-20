import * as Yup from 'yup'

const $string = 'permanently delete'

type FormValues = { 'permanently-delete': string }
const validationSchema = Yup.object().shape({
  'permanently-delete': Yup.string()
    .required('Confirmation is required')
    .oneOf([$string], 'You must type "permanently delete" exactly to confirm')
})

export { validationSchema, $string }
export type { FormValues }
