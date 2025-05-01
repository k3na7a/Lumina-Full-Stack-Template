<script setup lang="ts">
import SubNavigationLayout from '@/app/layouts/sub-navigation/top-nav/sub-navigation.layout.vue'
import { ROUTE_NAMES } from '@/app/router/routes'
import { sub_navigation } from '@/library/data/types/sub-navigation.type'

import ErrorBoundary from '@/app/components/error-boundary/error-boundary.component.vue'

import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

const options: sub_navigation = [{ label: 'administration.users.label', name: ROUTE_NAMES.ADMIN_USERS }]

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.users.header" :routes="options">
    <template #content>
      <ErrorBoundary>
        <Suspense>
          <RouterView v-slot="{ Component }" :key="route.path">
            <component :is="Component" />
          </RouterView>
          <template #fallback>{{ $t('actions.loading') }}</template>
        </Suspense>
        <template #error> THERE WAS AN ERROR </template>
      </ErrorBoundary>
    </template>
  </SubNavigationLayout>
</template>
