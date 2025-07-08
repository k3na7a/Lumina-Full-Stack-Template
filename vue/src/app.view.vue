<script setup lang="ts">
import ToastComponent from '@/shared/components/toast/toast.component.vue'
import ModalComponent from '@/shared/components/modal/base/modal.component.vue'
import RenderedView from '@/shared/components/page/page.component.vue'

import { useApp } from './core/composables/app.composable'

const { renderKey, loading } = useApp()
</script>

<template>
  <template v-if="loading"> Loading... </template>
  <template v-else>
    <RenderedView :key="renderKey" />
  </template>

  <ModalComponent />
  <ToastComponent />
</template>
