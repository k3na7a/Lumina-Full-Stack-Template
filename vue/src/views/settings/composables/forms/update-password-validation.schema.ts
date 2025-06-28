import { PasswordValidation } from '@/library/regex/validation.regex'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  current_password: Yup.string().required(),
  password: Yup.string().required().matches(PasswordValidation.regex),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref('password')])
})

export { validationSchema }
