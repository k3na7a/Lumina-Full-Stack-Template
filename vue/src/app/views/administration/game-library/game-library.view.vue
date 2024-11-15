<script setup lang="ts">
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'

import SelectInputComponent from '@/app/components/inputs/select.input.vue'

import { ROUTE_NAMES } from '@/app/router/routes'
import { sub_navigation } from '@/library/data/types/sub-navigation.type'

const options: sub_navigation = [
  { label: 'administration.game-library.games.label', name: ROUTE_NAMES.ADMIN_GAMES_LIST },
  { label: 'administration.game-library.platforms.label', name: ROUTE_NAMES.ADMIN_GAMES_PLATFORMS_LIST },
  { label: 'administration.game-library.genres.label', name: ROUTE_NAMES.ADMIN_GAMES_GENRES_LIST },
  { label: 'administration.game-library.series.label', name: ROUTE_NAMES.ADMIN_GAMES_SERIES_LIST },
  { label: 'administration.game-library.developers.label', name: ROUTE_NAMES.ADMIN_GAMES_DEVELOPERS_LIST },
  { label: 'administration.game-library.publishers.label', name: ROUTE_NAMES.ADMIN_GAMES_PUBLISHERS_LIST },
  { label: 'administration.game-library.gametypes.label', name: ROUTE_NAMES.ADMIN_GAMES_GAMETYPES_LIST }
]

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()

const default_route = options.find((r) => r.name == route.name)

function updateRoute(value: { label: string; name: ROUTE_NAMES } | undefined): void {
  router.push({ name: value?.name })
}
</script>

<template>
  <div class="content-view-administration d-flex flex-column gap-2">
    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold">
        {{ $t('administration.game-library.title') }}
      </h4>
      <p class="text-muted fw-normal">
        {{ $t('administration.game-library.subtitle') }}
      </p>
    </div>
    <div class="card d-flex flex-column">
      <div class="section p-3 bg-alt d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center">
        <div class="row-header">
          <p class="fw-semibold text-light-alt">{{ $t('administration.game-library.category-header') }}:</p>
        </div>
        <div class="d-flex flex-column flex-grow-1">
          <SelectInputComponent name="navigation" @update="updateRoute" :value="default_route" :options>
            <template #option="{ option }">
              {{ $t(option.label) }}
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
