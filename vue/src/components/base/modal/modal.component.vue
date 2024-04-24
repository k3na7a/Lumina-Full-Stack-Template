<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import * as bootstrap from 'bootstrap'

import { ModalOptions, ModalStore, useModalStore } from '@/store/modal.store'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'

const store: ModalStore = useModalStore()

const localstate = reactive<{
  model: object
  loading: boolean
}>({ model: {}, loading: false })

const isOpen = computed<boolean>(() => store.isOpen)
const options = computed<ModalOptions>(() => store.options as ModalOptions)

const modalRef = ref<InstanceType<typeof HTMLElement>>()
const purge: () => void = store.purgeModal

onMounted(() => modalRef.value?.addEventListener('hidden.bs.modal', purge))
onUnmounted(() => modalRef.value?.removeEventListener('hidden.bs.modal', purge))

watch(isOpen, async (value: boolean, _prev: boolean): Promise<void> => {
  const myModal: bootstrap.Modal = bootstrap.Modal.getOrCreateInstance('#modal')

  if (value) myModal.show()
  else myModal.hide()
})
</script>

<template>
  <div ref="modalRef" class="modal fade" id="modal" data-bs-backdrop="static" role="dialog">
    <div class="modal-dialog" :class="`modal-${options.size}`">
      <div class="modal-content rounded-0 border border-dark">
        <component :is="options.view" v-model="localstate.model" v-bind="options.properties" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/sass/utils/utils';

#modal {
  & .modal-content {
    background-color: $backgroundLight;
    box-shadow: $boxShadow;
  }

  pointer-events: none;
}
</style>
