<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import NavbarComponent from '@/shared/components/navbar/navbar.component.vue'
import LanguagesDropdown from '@/shared/components/dropdown/languages-dropdown.component.vue'
import ErrorBoundary from '@/shared/components/error-boundary/error-boundary.v1.component.vue'

import { ROUTE_NAMES } from '@/library/enums/route-names.enum'

const $route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <NavbarComponent>
    <template #left>
      <div class="d-flex justify-content-center">
        <nav class="nav-logo d-flex justify-content-center">
          <div class="align-content-center">
            <RouterLink :to="{ name: ROUTE_NAMES.HOME }">
              <img class="logo border-radius" src="/vue.svg" />
            </RouterLink>
          </div>
        </nav>
      </div>
    </template>
    <template #right>
      <div class="d-flex me-2">
        <nav class="align-content-center flex-grow-1">
          <LanguagesDropdown />
        </nav>
      </div>
    </template>
  </NavbarComponent>

  <div class="content-wrapper d-flex flex-column flex-grow-1 overflow-auto">
    <RouterView v-slot="{ Component }" :key="$route.path">
      <template v-if="Component">
        <ErrorBoundary>
          <Suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              {{ $t('actions.loading') }}
            </template>
          </Suspense>
          <template #error>
            {{ $t('forms.error-general') }}
          </template>
        </ErrorBoundary>
      </template>
    </RouterView>
  </div>
</template>
