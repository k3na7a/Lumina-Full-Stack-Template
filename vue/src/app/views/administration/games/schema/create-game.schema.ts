import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  cover: Yup.mixed<File>().optional(),
  description: Yup.string().optional(),
  release_date: Yup.date().required(),
  slug: Yup.string().required()
})

export { validationSchema }
