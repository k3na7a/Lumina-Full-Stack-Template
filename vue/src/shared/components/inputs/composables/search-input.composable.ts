import { Ref, ref, watch } from 'vue'
import { PromisifyFn, useDebounceFn } from '@vueuse/core'

import { deepEqual } from '@/../../library/utilities/object.util'

import { second } from '@/../../library/constants/time.constants'

type proptype = { disabled?: boolean; value?: string }

type SearchInput = {
  value: Ref<string | undefined>
  inputRef: Ref<HTMLElement | undefined>
  debouncedFn: PromisifyFn<(val: string | undefined) => void>
  giveFocus: (event: PointerEvent) => void
}

function useSearchInput(
  props: proptype,
  emit: ((evt: 'update', value: string | undefined) => void) & ((evt: 'submit', value: string | undefined) => void)
): SearchInput {
  const value = ref<string | undefined>(props.value)
  const inputRef = ref<InstanceType<typeof HTMLElement>>()

  const debouncedFn = useDebounceFn((val: string | undefined) => {
    emit('update', val || undefined)
  }, 0.75 * second)

  function giveFocus(event: PointerEvent): void {
    event.preventDefault()
    const input = inputRef.value as HTMLInputElement
    input.focus()
  }

  watch(
    () => props.value,
    (val) => {
      if (!deepEqual(val, value.value)) {
        value.value = val
      }
    }
  )

  watch(value, debouncedFn)

  return { value, inputRef, debouncedFn, giveFocus }
}

export type { SearchInput, proptype }
export { useSearchInput }
