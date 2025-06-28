import { PasswordValidation } from '@/library/regex/validation.regex'
import * as Yup from 'yup'

type registrationValues = { firstname: string; lastname: string; email: string; password: string }
const validationSchema = Yup.object().shape({
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required().matches(PasswordValidation.regex)
})

export { validationSchema }
export type { registrationValues }
