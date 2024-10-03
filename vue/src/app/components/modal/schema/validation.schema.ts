import { PasswordValidation } from '@/library/data/regex/validation.regex'
import * as Yup from 'yup'

type inputPasswordValues = { password: string }
const inputPassword = Yup.object().shape({
  password: Yup.string().required()
})

type imageUploadValues = { image: File }
const imageUpload = Yup.object().shape({
  image: Yup.mixed<File>().required()
})

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

export { inputPassword, imageUpload, registration, signIn }
export type { inputPasswordValues, imageUploadValues }
