import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required(),
  lastname: Yup.string().required()
})

export { validationSchema }
