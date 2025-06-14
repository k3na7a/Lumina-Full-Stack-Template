import { PasswordValidation } from '@/library/data/regex/validation.regex'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  new_password: Yup.string().required().matches(PasswordValidation.regex),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref('new_password')])
})

export { validationSchema }
