<script setup lang="ts">
import SubNavigationLayout from '@/app/layouts/sub-navigation/top-nav/sub-navigation.layout.vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { options } from './schema/navigation.schema'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.users.header" :routes="options">
    <template #content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.path">
          <component :is="Component" />
        </RouterView>
        <template #fallback>{{ $t('actions.loading') }}</template>
      </Suspense>
    </template>
  </SubNavigationLayout>
</template>
