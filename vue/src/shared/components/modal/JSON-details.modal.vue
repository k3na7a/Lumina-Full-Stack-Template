<script setup lang="ts">
import ModalTitle from '@/shared/components/modal/base/modal-title.component.vue'
import CodeBlock from './widgets/code-block.widget.vue'

type block = { item: Record<string, unknown>; title?: string }

const props = defineProps<{ items: block[]; title: string }>()
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <ModalTitle :title="$t(props.title)" />

    <CodeBlock v-for="(block, idx) in props.items" :key="`${idx}`" :item="block.item" :title="block.title" />
  </div>
</template>
