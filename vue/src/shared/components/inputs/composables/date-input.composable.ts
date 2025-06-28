import { onMounted, onUnmounted, Ref, ref, toRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import moment from 'moment'
import { useField } from 'vee-validate'

import { months } from '@/library/constants/date.constants'

type proptype = { name: string; value?: Date }

type DateInput = {
  value: Ref<Date | undefined>
  todayTimestamp: moment.Moment
  month: Ref<number>
  year: Ref<number>
  dropdownRef: Ref<HTMLElement | undefined>
  set: (event: MouseEvent) => void
  clear: () => void
  setToday: () => void
  updateMonth: (offset: number) => void
  updateYear: (offset: number) => void
  closeDropdown: () => void
  toggleDropdown: () => void
  getMonthStr: (month: number) => string
  errorMessage: Ref<string | undefined>
}

function useDateInput(props: proptype, emit: (evt: 'update', value: Date | undefined) => void): DateInput {
  const todayTimestamp = moment().startOf('day')
  const date = new Date()

  const name = toRef(props, 'name')
  const dropdownRef = ref<InstanceType<typeof HTMLElement>>()

  const { value, errorMessage } = useField<Date | undefined>(name.value, undefined, {
    initialValue: props.value
  })

  const year = ref<number>(value.value?.getFullYear() || date.getFullYear())
  const month = ref<number>(value.value?.getMonth() || date.getMonth())

  function closeDropdown(): void {
    const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
    dropdown.hide()
  }

  function toggleDropdown(): void {
    const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
    dropdown.toggle()
  }

  function reset(): void {
    if (value.value) {
      year.value = value.value.getFullYear()
      month.value = value.value.getMonth()
    } else {
      year.value = date.getFullYear()
      month.value = date.getMonth()
    }
  }

  function clear(): void {
    value.value = undefined
    closeDropdown()
  }

  function set(event: MouseEvent): void {
    const target = event.target as HTMLButtonElement
    value.value = new Date(parseInt(target.id))
    closeDropdown()
  }

  function setToday(): void {
    value.value = todayTimestamp.toDate()
    closeDropdown()
  }

  function getMonthStr(month: number): string {
    return months[Math.max(Math.min(11, month), 0)]
  }

  function updateYear(offset: number): void {
    year.value = year.value + offset
  }

  function updateMonth(offset: number): void {
    month.value = month.value + offset

    if (month.value === -1) {
      month.value = 11
      year.value--
    } else if (month.value === 12) {
      month.value = 0
      year.value++
    }
  }

  onMounted(() => {
    dropdownRef.value?.addEventListener('hidden.bs.dropdown', reset)
  })
  onUnmounted(() => {
    dropdownRef.value?.removeEventListener('hidden.bs.dropdown', reset)
  })

  watch(value, (newVal: Date | undefined) => {
    emit('update', newVal)
  })

  return {
    value,
    todayTimestamp,
    month,
    year,
    dropdownRef,
    set,
    clear,
    setToday,
    updateMonth,
    updateYear,
    closeDropdown,
    toggleDropdown,
    getMonthStr,
    errorMessage
  }
}

export type { DateInput, proptype }
export { useDateInput }
