<script setup lang="ts">
import { sub_navigation } from '@/library/types/sub-navigation.type'

import HeaderComponent from './components/layout-header.component.vue'

type PropType = { title: string; routes: sub_navigation }
const props = defineProps<PropType>()
</script>

<template>
  <main class="d-flex flex-column flex-grow-1 h-100 overflow-hidden">
    <HeaderComponent :title="props.title" :routes="props.routes" />
    <div class="d-flex flex-column flex-grow-1 overflow-auto mh-100 px-3">
      <slot name="content"></slot>
    </div>
  </main>
</template>
