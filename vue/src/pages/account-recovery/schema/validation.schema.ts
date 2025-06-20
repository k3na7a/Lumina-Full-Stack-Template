import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required()
})

export { validationSchema }
