<script setup lang="ts">
import { markRaw } from 'vue'

import { useModalStore, ModalStore } from '@/store/modal.store'
import GenericModalComponent from '@/components/modal/templates/generic.modal.vue'

const modalStore: ModalStore = useModalStore()

const submit = (): void => {
  modalStore.openModal({
    title: 'TEST MODAL',
    view: markRaw(GenericModalComponent),
    properties: {
      text: 'THIS IS A TEST'
    }
  })
}
</script>

<template>
  <button
    type="button"
    class="btn btn-link link-light link-opacity-75-hover p-0 rounded-0 text-decoration-none"
    @click="submit"
  >
    Login
  </button>
</template>
