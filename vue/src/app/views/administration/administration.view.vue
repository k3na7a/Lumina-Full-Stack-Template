<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import AdminLayout from '@/app/layouts/sub-navigation/side-nav/side-nav.layout.vue'
import { routes } from './schema/navigation.schema'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <AdminLayout :routes title="administration.label">
    <template #content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.path">
          <component :is="Component" />
        </RouterView>
        <template #fallback>
          <div class="d-flex flex-column h-100 p-3">{{ $t('actions.loading') }}</div>
        </template>
      </Suspense>
    </template>
  </AdminLayout>
</template>
