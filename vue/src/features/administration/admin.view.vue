<script setup lang="ts">
import AdminLayout from '@/shared/components/navigation/side-nav.layout.vue'
import RenderedView from '@/shared/components/page/page.component.vue'

import { routes } from './config/admin-navigation.config'
</script>

<template>
  <AdminLayout :routes="routes" title="administration.label">
    <template #content>
      <RenderedView />
    </template>
  </AdminLayout>
</template>
