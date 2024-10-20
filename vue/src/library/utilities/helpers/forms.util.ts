import * as Yup from 'yup'

type FormUtil = {
  getSubmitFn: <Schema extends Yup.ObjectSchema<Record<string, any>>>(
    _: Schema,
    callback: (values: Yup.InferType<Schema>) => void
  ) => (values: Record<string, any>) => void
}

function useFormUtil(): FormUtil {
  function getSubmitFn<Schema extends Yup.ObjectSchema<Record<string, any>>>(
    _: Schema,
    callback: (values: Yup.InferType<Schema>) => void
  ) {
    return (values: Record<string, any>) => {
      return callback(values)
    }
  }

  return {
    getSubmitFn
  }
}

export { useFormUtil }
export type { FormUtil }
