<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import * as bootstrap from 'bootstrap'

import { ModalAction, ModalOptions, ModalStore, useModalStore } from '@/store/modal.store'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'

const store: ModalStore = useModalStore()

const localstate = reactive<{
  model: object
  loading: boolean
}>({ model: {}, loading: false })

const isOpen = computed<boolean>(() => store.isOpen)
const options = computed<ModalOptions>(() => store.options as ModalOptions)

const callback = (model: object, action: ModalAction): void => {
  localstate.loading = true
  action.callback(model).finally(() => {
    localstate.loading = false
  })
}

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
        <div class="modal-header rounded-0 border-0 d-flex justify-content-between">
          <span class="modal-title fw-bold fs-6">{{ options.title }}</span>
          <button type="button" class="btn btn-link link-light p-0" @click="store.closeModal">
            <font-awesome-icon :icon="['fas', 'close']" />
          </button>
        </div>

        <div class="modal-body">
          <component :is="options.view" v-model="localstate.model" v-bind="options.properties" />
        </div>

        <div v-if="options.actions && options.actions.length" class="modal-footer rounded-0 border-0">
          <div class="modal-action">
            <button
              v-for="(action, index) in options.actions"
              :data-indicator="localstate.loading"
              :disabled="localstate.loading"
              :class="`btn btn-${action.type} ${index < options.actions.length - 1 ? 'me-2' : ''}`"
              @click="(_event: MouseEvent) => callback(localstate.model, action)"
            >
              <strong class="indicator-label"> {{ action.label }} </strong>
              <span class="indicator-progress">{{ $t(`base.buttons.loading`) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
