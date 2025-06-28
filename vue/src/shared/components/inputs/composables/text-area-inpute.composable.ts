import { Ref, ref, toRef, watch } from 'vue'
import { useField } from 'vee-validate'

import { deepEqual } from '@/core/utils/object.util'

type proptype = {
  name: string
  rows: number
  disabled?: boolean
  value?: string
  placeholder?: string
  label?: string
}

type TextAreaInput = {
  name: Ref<string>
  value: Ref<string | undefined>
  errorMessage: Ref<string | undefined>
  handleBlur: (e?: Event, shouldValidate?: boolean) => void
  handleChange: (e: Event | unknown, shouldValidate?: boolean) => void
}

function useTextAreaInput(props: proptype, emit: (evt: 'update', value: string | undefined) => void): TextAreaInput {
  const name = toRef(props, 'name')
  const isSyncing = ref<boolean>(false)

  const { value, errorMessage, handleBlur, handleChange } = useField<string | undefined>(name.value, undefined, {
    initialValue: props.value
  })

  watch(
    () => props.value,
    (val: string | undefined) => {
      if (!deepEqual(val, value.value)) {
        isSyncing.value = true
        value.value = val
      }
    }
  )

  watch(value, (newVal: string | undefined) => {
    if (isSyncing.value) {
      isSyncing.value = false
      return
    }

    emit('update', newVal)
  })

  return {
    name,
    value,
    errorMessage,
    handleBlur,
    handleChange
  }
}

export type { TextAreaInput, proptype }
export { useTextAreaInput }
