import { useField } from 'vee-validate'
import { Ref, ref, toRef, watch } from 'vue'

type proptype = { name: string; label?: string; value?: TriState }
type TriState = boolean | 'indeterminate'

type CheckpointInput = {
  inputRef: Ref<HTMLElement | undefined>
  name: Ref<string>
  value: Ref<TriState>
}

function useCheckboxInput(props: proptype, emit: (evt: 'update', value: TriState) => void): CheckpointInput {
  const inputRef = ref<InstanceType<typeof HTMLElement>>()
  const name = toRef(props, 'name')
  const isSyncing = ref<boolean>(false)

  const { value } = useField<TriState>(name.value, undefined, { initialValue: props.value })

  watch(
    () => props.value,
    (newValue?: TriState) => {
      if (newValue !== undefined) {
        isSyncing.value = true
        value.value = newValue
      }
    }
  )

  watch(value, (newVal: TriState) => {
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
