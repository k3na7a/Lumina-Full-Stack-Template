<script setup lang="ts">
import { sub_navigation } from '@/shared/components/navigation/types/sub-navigation.type'

type props = { title: string; subtitle?: string; routes: sub_navigation }

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  return route.meta.breadcrumbs ?? []
})

const { title, subtitle, routes } = defineProps<props>()
</script>

<template>
  <header class="th-header d-flex flex-column gap-1 p-3 pb-0">
    <div v-if="breadcrumbs.length">
      <ol class="d-flex flex-row gap-2 flex-wrap m-0 p-0 align-items-center text-primary" style="list-style-type: none">
        <li class="text-light-alt">
          <font-awesome-icon size="lg" :icon="['far', 'bookmark']" />
        </li>
        <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
          <li>
            <RouterLink
              v-if="crumb.to"
              :to="{ name: crumb.to }"
              class="link-offset-2 link-underline link-underline-opacity-75-hover"
            >
              <p>{{ $t(crumb.name) }}</p>
            </RouterLink>
            <p v-else class="text-muted">{{ $t(crumb.name) }}</p>
          </li>
          <template v-if="idx < breadcrumbs.length - 1">
            <li class="text-light-alt">
              <font-awesome-icon size="sm" :icon="['fas', 'chevron-right']" />
            </li>
          </template>
        </template>
      </ol>
    </div>
    <div class="d-flex flex-column">
      <h2 class="fw-bold display-font text-truncate">
        {{ $t(title) }}
      </h2>
      <h4 v-if="subtitle" class="text-light-alt">{{ $t(subtitle) }}</h4>
    </div>
    <ul class="d-flex nav nav-underline">
      <li v-for="route of routes" class="nav-item" :key="route.name">
        <RouterLink :to="{ name: route.name }" class="nav-link fw-semibold text-light" activeClass="active">
          {{ $t(route.label) }}
        </RouterLink>
      </li>
    </ul>
  </header>
</template>