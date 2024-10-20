<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import OffcanvasComponent from '@/library/components/offcanvas/offcanvas.component.vue'
import ToastComponent from '@/library/components/toast/toast.component.vue'
import ModalComponent from '@/library/components/modal/base/modal.component.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <Suspense>
    <RouterView v-slot="{ Component }" :key="route.fullPath">
      <component :is="Component" />
    </RouterView>
  </Suspense>

  <ModalComponent />
  <OffcanvasComponent />
  <ToastComponent />
</template>
