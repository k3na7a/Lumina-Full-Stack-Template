import { reactive, ref, toRef, UnwrapRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { useField } from 'vee-validate'
import { useDebounceFn } from '@vueuse/core'

import { checkIds, deepEqual } from '@lib/utilities/object.util'

import { PaginationOptions, PaginationDto, Order } from '@lib/dto/pagination.dto'
import { second } from '@lib/constants/time.constants'

type proptype<T> = {
  name: string
  auto?: boolean
  value?: Array<T>
  options: PaginationOptions
  callback: (params: PaginationOptions) => Promise<PaginationDto<T>>
}

function useSearchPaginatedInput<T>(props: proptype<T>, emit: (evt: 'update', value: T[] | undefined) => void) {
  const name = toRef(props, 'name')

  const { value } = useField<T[]>(name.value, undefined, { initialValue: props.value })

  const SearchRef = ref<InstanceType<typeof HTMLElement>>()
  const inputRef = ref<InstanceType<typeof HTMLElement>>()

  const activeIndex = ref<number>(-1)
  const optionRefs = ref<HTMLElement[]>([])
  const filter = ref<string>()

  const isSyncing = ref<boolean>(false)
  const loading = ref<boolean>(true)

  const response = reactive<{ data: Array<T> }>({ data: [] })

  const defaultOptions: PaginationOptions = {
    take: 25,
    order: Order.ASC,
    page: 1
  }

  const debouncedFn = useDebounceFn(async (val: string | undefined) => {
    loading.value = true
    await props
      .callback({
        ...defaultOptions,
        sort: props.options.sort,
        search: val
      })
      .then((res: PaginationDto<T>) => {
        response.data = res.data as UnwrapRef<T[]>
      })
      .finally(() => {
        loading.value = false
      })
  }, 0.5 * second)

  function onKeydownResolver(event: KeyboardEvent): void {
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
      case 'Delete':
        clear()
        break
      case 'Backspace':
        onBackspace()
        break
      case 'Escape':
        closeDropdown()
        break
      default:
        break
    }
  }

  function resetNavigation(): void {
    activeIndex.value = 0
    optionRefs.value = []
  }

  function closeDropdown(): void {
    const dropdown: bootstrap.Dropdown = bootstrap.Dropdown.getOrCreateInstance(SearchRef.value || '')

    dropdown.hide()
  }

  function openDropdown(): void {
    const dropdown: bootstrap.Dropdown = bootstrap.Dropdown.getOrCreateInstance(SearchRef.value!)

    const isOpen: boolean | undefined = SearchRef.value?.querySelector('.dropdown-menu')?.classList.contains('show')
    if (isOpen) return

    dropdown.show()
    resetNavigation()
  }

  function giveFocus(event: PointerEvent): void {
    event.preventDefault()
    const input = inputRef.value as HTMLInputElement
    input.focus()
  }

  function onBackspace(): void {
    if (!filter.value && value.value?.length) value.value.pop()
  }

  function onFocus(): void {
    openDropdown()
  }

  function clear(): void {
    value.value?.splice(0)
  }

  function navigate(direction: number): void {
    if (!response.data.length) return

    const next = activeIndex.value + direction

    if (next < 0) activeIndex.value = response.data.length - 1
    else if (next >= response.data.length) activeIndex.value = 0
    else activeIndex.value = next
  }

  function handleEnter(): void {
    if (activeIndex.value >= 0 && activeIndex.value < response.data.length)
      selectItem(response.data[activeIndex.value] as T)
  }

  function selectItem(item: T): void {
    if (!value.value?.some((e) => checkIds(e, item))) value.value?.push(item)
  }

  function setOptionRef(el: HTMLElement | null): void {
    if (!el) return
    const index = parseInt(el.dataset.index!)
    optionRefs.value[index] = el
  }

  watch(
    () => props.value,
    (val: T[] | undefined) => {
      if (!deepEqual(val, value.value)) {
        isSyncing.value = true
        value.value = val || []
      }
    }
  )

  watch(value, (newVal: T[] | undefined) => {
    if (isSyncing.value) {
      isSyncing.value = false
      return
    }

    emit('update', newVal)
    closeDropdown()
  })

  watch(filter, debouncedFn, { immediate: true })
  watch(
    () => response.data,
    () => resetNavigation()
  )

  return {
    giveFocus,
    onFocus,
    closeDropdown,
    onKeydownResolver,
    selectItem,
    value,
    activeIndex,
    filter,
    loading,
    response,
    SearchRef,
    inputRef,
    setOptionRef
  }
}

export type { proptype }
export { useSearchPaginatedInput }
