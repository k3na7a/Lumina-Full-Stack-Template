import * as Yup from 'yup'

import { Role } from '@/core/apis/dto/user.dto'

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  role: Yup.mixed<Role>().oneOf(Object.values(Role)).required(),
  avatar: Yup.mixed<File>().notRequired(),
  'remove-avatar': Yup.boolean().required()
})

export { validationSchema }
