<script setup lang="ts">
import Layout from '../layouts/event.layout.vue'
import ModalTitle from '@/shared/components/modal/base/modal-title.component.vue'

const props = defineProps<{ title: string }>()
</script>

<template>
  <Layout>
    <template #title>
      <ModalTitle :title="$t(props.title)" />
    </template>
  </Layout>
</template>
