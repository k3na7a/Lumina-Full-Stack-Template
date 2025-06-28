import type { AnyObjectSchema } from 'yup'
import type { SubmissionContext } from 'vee-validate'

type SubmitHandler<T> = (values: T, context: SubmissionContext) => Promise<void>

export function useFormUtil() {
  function getSubmitFn<T>(_: AnyObjectSchema, handler: SubmitHandler<T>) {
    return async (values: T, context: SubmissionContext) => {
      await handler(values, context)
    }
  }

  return { getSubmitFn }
}
