<script setup lang="ts">
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'

import SelectInputComponent from '@/app/components/inputs/select.input.vue'

import { ROUTE_NAMES } from '@/app/router/routes'
import { games_library_navigation } from './config/navigation.config'

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()

const options = games_library_navigation
const default_route = options.find((r) => r.name == route.name)

function updateRoute(value: { label: string; name: ROUTE_NAMES } | undefined): void {
  router.push({ name: value?.name })
}
</script>

<template>
  <div class="content-view-administration d-flex flex-column gap-2">
    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold">
        {{ $t('Manage your game library') }}
      </h4>
      <p class="text-muted fw-normal">
        {{ $t('Game library is a collection of your video game resources') }}
      </p>
    </div>
    <div class="card d-flex flex-column">
      <div class="section p-3 bg-alt d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center">
        <div class="row-header">
          <p class="fw-semibold text-light-alt">{{ $t('Category:') }}</p>
        </div>
        <div class="d-flex flex-column flex-grow-1">
          <SelectInputComponent name="navigation" @update="updateRoute" :value="default_route" :options>
            <template #option="{ option }">
              {{ option.label }}
            </template>
          </SelectInputComponent>
        </div>
      </div>
      <div class="section p-3">
        <Suspense>
          <RouterView v-slot="{ Component }" :key="route.fullPath">
            <component :is="Component" />
          </RouterView>
          <template #fallback>
            <div class="d-flex justify-content-center">
              <span class="loader"></span>
            </div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>
