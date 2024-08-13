<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import OffcanvasComponent from '@/components/offcanvas/offcanvas.component.vue'
import ToastComponent from '@/components/toast/toast.component.vue'
import ModalComponent from '@/components/modal/base/modal.component.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <RouterView v-slot="{ Component }" :key="route.fullPath">
    <component :is="Component" />
  </RouterView>

  <ModalComponent />
  <OffcanvasComponent />
  <ToastComponent />
</template>
