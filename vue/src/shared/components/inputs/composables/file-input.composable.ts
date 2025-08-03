import { useField } from 'vee-validate'
import { onMounted, Ref, ref, toRef, watch } from 'vue'

type proptype = { name: string }

type FileInput = {
  name: Ref<string>
  value: Ref<File | undefined>
  onChange: (event: Event) => void
  removeFile: (_: MouseEvent) => void
}

function useFileInput(props: proptype, emit: (evt: 'update', value: File | undefined) => void): FileInput {
  const name = toRef(props, 'name')
  const inputRef = ref<InstanceType<typeof HTMLInputElement>>()

  const { value } = useField<File | undefined>(name.value, undefined, { initialValue: undefined })

  function onChange(event: Event) {
    const target = event.target as HTMLInputElement
    const files: FileList | null = target.files

    value.value = files?.length ? files[0] : undefined
  }

  function removeFile(_: MouseEvent) {
    value.value = undefined
    if (inputRef.value) inputRef.value.value = ''
  }

  onMounted(() => {
    emit('update', value.value)
  })

  watch(value, (newVal: File | undefined) => {
    emit('update', newVal)
  })

  return {
    name,
    value,
    onChange,
    removeFile
  }
}

export type { FileInput, proptype }
export { useFileInput }
