import * as Yup from 'yup'

type inputPasswordValues = { password: string }
const inputPassword = Yup.object().shape({
  password: Yup.string().required()
})

type imageUploadValues = { image: File }
const imageUpload = Yup.object().shape({
  image: Yup.mixed<File>().required()
})

export { inputPassword, imageUpload }
export type { inputPasswordValues, imageUploadValues }
