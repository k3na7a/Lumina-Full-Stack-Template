<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import headerComponent from '@/app/layouts/settings/components/header.component.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <main id="settings-view" class="d-flex flex-column flex-grow-1 h-100 overflow-hidden">
    <headerComponent />
    <div class="content d-flex flex-column flex-grow-1 overflow-auto mh-100 px-3">
      <RouterView v-slot="{ Component }" :key="route.fullPath">
        <component :is="Component" />
      </RouterView>
    </div>
  </main>
</template>

<style lang="scss">
@import '@/app/sass/variables/index';

#settings-view {
  .content {
    padding-right: calc(2rem - $scroll-width) !important;
    scrollbar-gutter: stable;
  }
}
</style>
