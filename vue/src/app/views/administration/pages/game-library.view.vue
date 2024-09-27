<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import SelectInputComponent from '@/app/components/inputs/input.select.component.vue'
import { ROUTE_NAMES } from '@/app/router/routes.enum'

const route: RouteLocationNormalizedLoaded = useRoute()

const routes = [
  { label: 'Games', route_name: ROUTE_NAMES.ADMIN_GAMES_LIST },
  { label: 'Platforms', route_name: ROUTE_NAMES.ADMIN_GAMES_PLATFORMS_LIST }
]

const default_route = routes.find((r) => r.route_name == route.name)
</script>

<template>
  <div class="content-view-administration">
    <div class="mb-2">
      <h4 class="text-light fw-semibold">
        {{ $t('Manage your game library') }}
      </h4>
      <p class="text-muted fw-normal mb-2">
        {{ $t('Game library is a collection of your video game resources') }}
      </p>
    </div>
    <div class="card d-flex flex-column">
      <div class="section p-3 bg-alt">
        <SelectInputComponent name="navigation" style="width: 15rem" :default="default_route" :options="routes">
          <template v-slot:option="{ option }">
            {{ option.label }}
          </template>
        </SelectInputComponent>
      </div>
      <div class="section p-3">
        <Suspense>
          <RouterView v-slot="{ Component }" :key="route.fullPath">
            <component :is="Component" />
          </RouterView>
          <template #fallback>{{ $t('actions.loading') }}</template>
        </Suspense>
      </div>
    </div>
  </div>
</template>
