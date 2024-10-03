import { PasswordValidation } from '@/library/data/regex/validation.regex'
import * as Yup from 'yup'

const updateProfile = Yup.object().shape({
  firstname: Yup.string().required(),
  lastname: Yup.string().required()
})

const updateEmail = Yup.object().shape({
  password: Yup.string().required(),
  email: Yup.string().email().required(),
  confirm_email: Yup.string()
    .required()
    .oneOf([Yup.ref('email')])
})

const updatePassword = Yup.object().shape({
  current_password: Yup.string().required(),
  password: Yup.string().required().matches(PasswordValidation.regex),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref('password')])
})

export { updateProfile, updateEmail, updatePassword }
