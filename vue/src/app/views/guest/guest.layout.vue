<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import NavbarComponent from '@/app/components/navbar/navbar.component.vue'
import LanguagesDropdown from '@/app/layouts/main/components/dropdowns/languages-dropdown.component.vue'
import ErrorBoundary from '@/app/components/error-boundary/error-boundary.v1.component.vue'

const $route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <NavbarComponent>
    <template #left>
      <div class="d-flex justify-content-center">
        <nav class="nav-logo d-flex justify-content-center">
          <div class="align-content-center">
            <RouterLink :to="{ name: 'home' }">
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
