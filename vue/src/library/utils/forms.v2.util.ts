// // validateUtil.ts
// import type { AnyObjectSchema } from 'yup'
// import type { GenericObject, SubmissionContext } from 'vee-validate'

// type SubmitHandler<T extends GenericObject> = (values: T, context: SubmissionContext<T>) => Promise<void>

// export function useFormUtil() {
//   function getSubmitFn<T extends GenericObject>(_: AnyObjectSchema, handler: SubmitHandler<T>) {
//     return async (values: T, context: SubmissionContext<T>) => {
//       try {
//         await handler(values, context)
//       } catch (err) {
//         console.error('Form submit error:', err)
//         // You can hook into setErrors if needed here
//       }
//     }
//   }

//   return { getSubmitFn }
// }

import type { AnyObjectSchema } from 'yup'
import type { SubmissionContext } from 'vee-validate'

type SubmitHandler<T> = (values: T, context: SubmissionContext) => Promise<void>

export function useFormUtil() {
  function getSubmitFn<T>(
    _schema: AnyObjectSchema, // you can use this if you're validating manually, or just pass it through
    handler: SubmitHandler<T>
  ) {
    return async (values: T, context: SubmissionContext) => {
      await handler(values, context)
    }
  }

  return { getSubmitFn }
}
