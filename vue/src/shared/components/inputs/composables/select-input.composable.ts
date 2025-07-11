import { onBeforeUnmount, onMounted, Ref, ref, toRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { FieldMeta, useField } from 'vee-validate'

import { deepEqual } from '@/core/utils/object.util'

type proptype<T> = {
  name: string
  value?: T
  options: Array<T>
  disabled?: boolean
  icon?: [string, string]
}

type SelectInput<T> = {
  dropdownRef: Ref<HTMLElement | undefined>
  value: Ref<T | undefined>
  meta: FieldMeta<T | undefined>
  errorMessage: Ref<string | undefined>
  activeIndex: Ref<number>
  onKeydownResolver: (event: KeyboardEvent) => void
  onFocusOut: (event: FocusEvent) => void
  stopClick: (e: MouseEvent) => void
  openDropdown: () => void
  closeDropdown: () => void
  selectItem: (item: T) => void
  setOptionRef: (el: HTMLElement | null) => void
}

function useSelectInput<T>(props: proptype<T>, emit: (evt: 'update', value: T | undefined) => void): SelectInput<T> {
  const name = toRef(props, 'name')
  const isOpen = ref(false)
  const isSyncing = ref<boolean>(false)
  const dropdownRef = ref<InstanceType<typeof HTMLElement>>()

  const activeIndex = ref<number>(0)
  const optionRefs = ref<HTMLElement[]>([])

  const { value, errorMessage, meta } = useField<T | undefined>(name.value, undefined, { initialValue: props.value })

  function onKeydownResolver(event: KeyboardEvent): void {
    if (!isOpen.value) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        navigate(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        navigate(-1)
        break
      case 'Enter':
        event.preventDefault()
        handleEnter()
        break
      case 'Escape':
        closeDropdown()
        break
      default:
        break
    }
  }

  function navigate(direction: number): void {
    if (!props.options.length) return

    const next = activeIndex.value + direction

    if (next < 0) activeIndex.value = props.options.length - 1
    else if (next >= props.options.length) activeIndex.value = 0
    else activeIndex.value = next
  }

  function handleEnter(): void {
    if (activeIndex.value >= 0 && activeIndex.value < props.options.length)
      selectItem(props.options[activeIndex.value] as T)
  }

  function selectItem(item: T): void {
    value.value = item
  }

  function stopClick(e: MouseEvent): void {
    e.stopPropagation()
  }

  function openDropdown(): void {
    if (isOpen.value) return

    const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
    dropdown.show()
    isOpen.value = true
  }

  function onFocusOut(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement | null

    if (!dropdownRef.value?.contains(relatedTarget)) {
      closeDropdown()
    }
  }

  function setOptionRef(el: HTMLElement | null): void {
    if (!el) return
    const index = parseInt(el.dataset.index!)
    optionRefs.value[index] = el
  }

  function closeDropdown(): void {
    const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
    dropdown.hide()
  }

  onMounted(() => {
    const dropdownEl = dropdownRef.value
    if (!dropdownEl) return

    const onShow = () => (isOpen.value = true)
    const onHide = () => (isOpen.value = false)

    dropdownEl.addEventListener('show.bs.dropdown', onShow)
    dropdownEl.addEventListener('hide.bs.dropdown', onHide)

    onBeforeUnmount(() => {
      dropdownEl.removeEventListener('show.bs.dropdown', onShow)
      dropdownEl.removeEventListener('hide.bs.dropdown', onHide)
    })
  })

  watch(
    () => props.value,
    (val: T | undefined) => {
      if (!deepEqual(val, value.value)) {
        isSyncing.value = true
        value.value = val
      }
    }
  )

  watch(value, (newVal: T | undefined) => {
    if (isSyncing.value) {
      isSyncing.value = false
      return
    }

    emit('update', newVal)
    closeDropdown()
  })

  return {
    dropdownRef,
    value,
    meta,
    errorMessage,
    activeIndex,
    stopClick,
    onKeydownResolver,
    onFocusOut,
    openDropdown,
    closeDropdown,
    setOptionRef,
    selectItem
  }
}

export type { SelectInput, proptype }
export { useSelectInput }
