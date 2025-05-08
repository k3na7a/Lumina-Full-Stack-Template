<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import SubNavigationLayout from '@/app/layouts/sub-navigation/top-nav/sub-navigation.layout.vue'
import { options } from './schema/navigation.schema'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="settings.title" subtitle="settings.subtitle" :routes="options">
    <template #content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.path">
          <component :is="Component" />
        </RouterView>
      </Suspense>
    </template>
  </SubNavigationLayout>
</template>
