<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import headerComponent from './components/layout-header.component.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <main class="d-flex flex-column flex-grow-1 h-100 overflow-hidden">
    <headerComponent />
    <div class="d-flex flex-column flex-grow-1 overflow-auto mh-100 px-3">
      <RouterView v-slot="{ Component }" :key="route.fullPath">
        <component :is="Component" />
      </RouterView>
    </div>
  </main>
</template>
