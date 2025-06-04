<script setup lang="ts">
import NavbarComponent from '@/app/components/navbar/navbar.component.vue'

import NavigationComponent from './components/navigation.component.vue'
import ActionComponent from './components/actions.component.vue'
import { useAuthStore } from '@/app/store/authentication.store'

const authStore = useAuthStore()
await authStore.init().catch(() => console.log('Could not authenticate.'))

await new Promise((resolve) => setTimeout(resolve, 2000))
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
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </RouterView>
  </div>
</template>
