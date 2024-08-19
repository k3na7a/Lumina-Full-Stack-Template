<script setup lang="ts">
import { sub_navigation } from '@/library/types/sub-navigation.type'

import HeaderComponent from './components/layout-header.component.vue'

type PropType = { title: string; routes: sub_navigation }
const props = defineProps<PropType>()
</script>

<template>
  <main class="sub-navigation-layout d-flex flex-column flex-grow-1 h-100">
    <HeaderComponent :title="props.title" :routes="props.routes" />
    <div class="sub-navigation-content d-flex flex-column flex-grow-1 mh-100 px-3">
      <div class="pt-2 pb-3 flex-grow-1">
        <slot name="content"></slot>
      </div>
    </div>
  </main>
</template>
