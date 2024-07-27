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
    <div class="modal-dialog modal-dialog-centered" :class="`modal-${options.size}`">
      <div class="modal-content p-4">
        <component :is="options.view" v-model="localstate.model" v-bind="options.properties" />
        <div class="modal-close">
          <button type="button" class="btn btn-link link-light link-opacity-75-hover p-0" v-on:click="store.closeModal">
            <span><font-awesome-icon :icon="['fas', 'close']" /></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/app/sass/utils/utils';

#modal {
  & .modal-content {
    position: relative;
    border-radius: $border-radius;
    background-color: $backgroundAlt;
    box-shadow: $boxShadow;

    .modal-close {
      position: absolute;
      top: 8px;
      right: 8px;

      button {
        width: 30px;
        height: 30px;
      }
    }
  }

  pointer-events: none;
}
</style>
