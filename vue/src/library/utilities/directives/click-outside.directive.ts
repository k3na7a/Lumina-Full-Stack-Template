const click_outside: {
  beforeMount(el: any, binding: any): void
  unmounted(el: any): void
} = {
  beforeMount(el: any, binding: any): void {
    el.clickOutsideEvent = function (event: Event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }

    document.addEventListener('mousedown', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('mousedown', el.clickOutsideEvent)
  }
}

export { click_outside }
