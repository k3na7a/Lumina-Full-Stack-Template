<script setup lang="ts">
import NavbarComponent from '@/app/components/navbar/navbar.component.vue'

import NavigationComponent from './components/navigation.component.vue'
import ActionComponent from './components/actions.component.vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <NavbarComponent>
    <template #left>
      <NavigationComponent />
    </template>

    <template #right>
      <ActionComponent />
    </template>
  </NavbarComponent>

  <div class="content-wrapper d-flex flex-column flex-grow-1 overflow-auto">
    <Suspense>
      <RouterView v-slot="{ Component }" :key="route.path">
        <component :is="Component" />
      </RouterView>
    </Suspense>
  </div>
</template>
