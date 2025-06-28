<script setup lang="ts">
import { sub_navigation } from '@/library/types/sub-navigation.type'

import HeaderComponent from '@/shared/components/header/topnav-header.component.vue'

const { title, subtitle, routes } = defineProps<{ title: string; subtitle?: string; routes: sub_navigation }>()
</script>

<template>
  <div class="sub-navigation-layout d-flex flex-column flex-grow-1 h-100">
    <HeaderComponent :title="title" :subtitle="subtitle" :routes="routes" />
    <div class="sub-navigation-content d-flex flex-column flex-grow-1 mh-100 px-3">
      <div class="pt-2 pb-3 flex-grow-1">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
