<script setup lang="ts">
import { sub_navigation } from '@/library/types/sub-navigation.type'

type props = { title: string; subtitle?: string; routes: sub_navigation }

const { title, subtitle, routes } = defineProps<props>()
</script>

<template>
  <header class="th-header d-flex flex-column gap-1 p-3 pb-0">
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
