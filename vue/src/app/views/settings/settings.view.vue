<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { settings_navigation } from '@/app/views/settings/config/navigation.config'

import SubNavigationLayout from '@/app/layouts/sub-navigation/sub-navigation.layout.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.settings.label" :routes="settings_navigation">
    <template #content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.fullPath">
          <component :is="Component" />
        </RouterView>
      </Suspense>
    </template>
  </SubNavigationLayout>
</template>
