<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import ToastComponent from '@/app/components/toast/toast.component.vue'
import ModalComponent from '@/app/components/modal/modal.component.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <Suspense>
    <RouterView v-slot="{ Component }" :key="route.path">
      <component :is="Component" />
    </RouterView>
  </Suspense>

  <ModalComponent />
  <ToastComponent />
</template>
