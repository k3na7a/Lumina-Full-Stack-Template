import { PasswordValidation } from '@/library/regex/validation.regex'
import * as Yup from 'yup'

const registration = Yup.object().shape({
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required().matches(PasswordValidation.regex)
})

const signIn = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required()
})

export { registration, signIn }
