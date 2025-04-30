<script setup lang="ts">
import { sub_navigation } from '@/library/data/types/sub-navigation.type'

const props = defineProps<{ title: string; subtitle?: string; routes: sub_navigation }>()
</script>

<template>
  <header class="settings-header d-flex flex-column gap-1 p-3 pb-0">
    <div class="d-flex flex-column">
      <h2 class="fw-bold display-font text-truncate">
        {{ $t(props.title) }}
      </h2>
      <h4 v-if="props.subtitle" class="text-light-alt">{{ $t(props.subtitle) }}</h4>
    </div>
    <ul class="d-flex nav nav-underline">
      <li v-for="route of props.routes" class="nav-item" :key="route.name">
        <RouterLink :to="{ name: route.name }" class="nav-link fw-semibold text-light" activeClass="active">
          {{ $t(route.label) }}
        </RouterLink>
      </li>
    </ul>
  </header>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

header.settings-header {
  ul.nav {
    box-shadow: inset 0 calc(-1 * 0.1rem) 0 rgba(255, 255, 255, 0.2);
    font-size: $font-size-5;
    column-gap: 2rem;
    row-gap: 0.5rem;
  }

  a.nav-link {
    font-weight: inherit;
    border-bottom: 0.2rem solid transparent;

    &:hover,
    &.active {
      color: $primary !important;
      font-weight: inherit;
    }

    &:hover:not(.active),
    &:focus:not(.active) {
      border-color: transparent;
    }
  }
}
</style>
