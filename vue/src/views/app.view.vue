<script setup lang="ts">
import { provide, ref } from 'vue'

import ToastComponent from '@/shared/components/toast/toast.component.vue'
import ModalComponent from '@/shared/components/modal/base/modal.component.vue'

import RenderedView from '@/shared/components/page/page.component.vue'

const UpdateKeySymbol = Symbol('updateKey')
type UpdateKeyFn = () => void

const renderKey = ref(Date.now())
const updateKey: UpdateKeyFn = () => (renderKey.value = Date.now())

provide(UpdateKeySymbol, updateKey)
</script>

<template>
  <RenderedView :key="renderKey" />

  <ModalComponent />
  <ToastComponent />
</template>
