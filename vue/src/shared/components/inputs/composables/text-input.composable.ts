import { InputTypeHTMLAttribute, Ref, ref, toRef, watch } from 'vue'
import { useField } from 'vee-validate'

import { deepEqual } from '@lib/utilities/object.util'

import { HTMLAutoComplete } from '@/shared/components/inputs/types/HTMLautocomplete.type'

type proptype = {
  name: string
  disabled?: boolean
  type: InputTypeHTMLAttribute
  value?: string
  autocomplete?: HTMLAutoComplete
  placeholder?: string
  label?: string
}

type TextInput = {
  name: Ref<string>
  value: Ref<string | undefined>
  errorMessage: Ref<string | undefined>
  handleBlur: (e?: Event, shouldValidate?: boolean) => void
  handleChange: (e: Event | unknown, shouldValidate?: boolean) => void
}

function useTextInput(props: proptype, emit: (evt: 'update', value: string | undefined) => void): TextInput {
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

export type { TextInput, proptype }
export { useTextInput }
