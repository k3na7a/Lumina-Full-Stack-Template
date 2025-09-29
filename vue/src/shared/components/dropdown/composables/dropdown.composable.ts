import { onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import * as bootstrap from 'bootstrap'

type Dropdown = {
  dropdownRef: Ref<HTMLElement | undefined>
  closeDropdown: () => void
  toggleDropdown: () => void
}

function useDropdown(): Dropdown {
  const dropdownRef = ref<InstanceType<typeof HTMLElement>>()
  const isOpen = ref(false)

  function closeDropdown(): void {
    const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
    dropdown.hide()
  }

  function toggleDropdown(): void {
    const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
    dropdown.toggle()
  }

  onMounted(() => {
    if (dropdownRef.value) {
      dropdownRef.value.addEventListener('shown.bs.dropdown', () => {
        isOpen.value = true
      })
      dropdownRef.value.addEventListener('hidden.bs.dropdown', () => {
        isOpen.value = false
      })
    }
  })

  onBeforeUnmount(() => {
    if (dropdownRef.value) {
      dropdownRef.value.removeEventListener('shown.bs.dropdown', () => {})
      dropdownRef.value.removeEventListener('hidden.bs.dropdown', () => {})
    }
  })

  return {
    dropdownRef,
    closeDropdown,
    toggleDropdown
  }
}

export type { Dropdown }
export { useDropdown }
