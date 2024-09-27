<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { administration_navigation } from '@/app/views/administration/schema/navigation.config'

import SubNavigationLayout from '@/app/layouts/sub-navigation/sub-navigation.layout.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.label" :routes="administration_navigation">
    <template v-slot:content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.fullPath">
          <component :is="Component" />
        </RouterView>
        <template #fallback>{{ $t('actions.loading') }}</template>
      </Suspense>
    </template>
  </SubNavigationLayout>
</template>
