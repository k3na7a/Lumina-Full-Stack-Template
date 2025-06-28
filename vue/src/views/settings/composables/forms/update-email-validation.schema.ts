import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  password: Yup.string().required(),
  email: Yup.string().email().required(),
  confirm_email: Yup.string()
    .required()
    .oneOf([Yup.ref('email')])
})

export { validationSchema }
