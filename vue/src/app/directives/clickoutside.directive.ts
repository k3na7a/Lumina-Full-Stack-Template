export default {
  beforeMount(el: any, binding: any): void {
    el.clickOutsideEvent = function (event: MouseEvent): void {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }

    document.addEventListener('click', el._clickOutsideEvent)
  },
  unmounted(el: any): void {
    document.removeEventListener('click', el._clickOutsideEvent)
  }
}
