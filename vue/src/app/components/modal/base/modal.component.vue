<script setup lang="ts">
import { computed, reactive, Ref, ref, watch } from 'vue'
import * as bootstrap from 'bootstrap'

import { ModalOptions, ModalStore, useModalStore } from '@/app/store/modal.store'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'

const store: ModalStore = useModalStore()

const localstate = reactive<{
  model: object
  loading: boolean
}>({ model: {}, loading: false })

const isOpen = computed<boolean>(() => store.isOpen)
const options = computed<ModalOptions>(() => store.options as ModalOptions)

const modalRef: Ref<HTMLElement | undefined> = ref<InstanceType<typeof HTMLElement>>()
const purge: () => void = store.purgeModal
const stopPropagation = (event: MouseEvent) => event.stopImmediatePropagation()
const close = (evt: KeyboardEvent): void => {
  if (evt.key === 'Escape') store.closeModal()
}

onMounted(() => {
  modalRef.value?.addEventListener('hidden.bs.modal', purge)
  modalRef.value?.addEventListener('mousedown', stopPropagation)
  document.addEventListener('keydown', close)
})
onUnmounted(() => {
  modalRef.value?.removeEventListener('hidden.bs.modal', purge)
  modalRef.value?.removeEventListener('mousedown', stopPropagation)
  document.removeEventListener('keydown', close)
})

watch(isOpen, async (value: boolean, _prev: boolean): Promise<void> => {
  const myModal: bootstrap.Modal = bootstrap.Modal.getOrCreateInstance('#modal')

  if (value) myModal.show()
  else myModal.hide()
})
</script>

<template>
  <div ref="modalRef" class="modal fade" id="modal" data-bs-backdrop="static" role="dialog">
    <div class="modal-dialog modal-dialog-centered" :class="`modal-${options.size}`">
      <div class="modal-content p-3 position-relative border-radius bg-alt box-shadow">
        <component :is="options.view" v-model="localstate.model" v-bind="options.properties" />
        <div class="modal-close position-absolute top-0 end-0">
          <button type="button" class="btn btn-icon-sm btn-dark p-0 me-2 mt-2" @click="store.closeModal">
            <font-awesome-icon size="lg" :icon="['fas', 'close']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.modal {
  .modal-close button {
    width: 3rem;
    height: 3rem;
  }

  backdrop-filter: blur(1.5rem);
}
</style>
