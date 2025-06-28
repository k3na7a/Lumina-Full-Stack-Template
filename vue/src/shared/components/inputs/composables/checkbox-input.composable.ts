import { useField } from 'vee-validate'
import { onMounted, Ref, ref, toRef, watch } from 'vue'

type proptype = { name: string; label?: string }

type CheckpointInput = {
  inputRef: Ref<HTMLElement | undefined>
  name: Ref<string>
  value: Ref<boolean>
}

function useCheckboxInput(props: proptype, emit: (evt: 'update', value: boolean) => void): CheckpointInput {
  const inputRef = ref<InstanceType<typeof HTMLElement>>()
  const name = toRef(props, 'name')

  const { value } = useField<boolean>(name.value, undefined, { initialValue: false })

  watch(value, (newVal: boolean) => {
    emit('update', newVal)
  })

  onMounted(() => {
    emit('update', value.value)
  })

  return { inputRef, name, value }
}

export type { proptype }
export { useCheckboxInput }
