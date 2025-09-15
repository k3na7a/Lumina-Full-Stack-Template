import { useField } from 'vee-validate'
import { Ref, ref, toRef, watch } from 'vue'

type proptype = { name: string; label?: string; value?: boolean }
type TriState = boolean | 'indeterminate'

type CheckpointInput = {
  inputRef: Ref<HTMLElement | undefined>
  name: Ref<string>
  value: Ref<boolean>
}

function useCheckboxInput(props: proptype, emit: (evt: 'update', value: boolean) => void): CheckpointInput {
  const inputRef = ref<InstanceType<typeof HTMLElement>>()
  const name = toRef(props, 'name')
  const isSyncing = ref<boolean>(false)

  const { value } = useField<boolean>(name.value, undefined, { initialValue: props.value })

  watch(
    () => props.value,
    (newValue?: boolean) => {
      if (newValue !== undefined) {
        isSyncing.value = true
        value.value = newValue
      }
    }
  )

  watch(value, (newVal: boolean) => {
    if (isSyncing.value) {
      isSyncing.value = false
      return
    }

    emit('update', newVal)
  })

  return { inputRef, name, value }
}

export type { proptype, TriState }
export { useCheckboxInput }
