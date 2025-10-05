<script setup lang="ts">
import { prettyDiffToHtml, toSafeJson } from '@lib/utilities/object.util'
import { computed, ComputedRef } from 'vue'

const props = defineProps<{ item: Record<string, unknown> | object; title?: string }>()
const html: ComputedRef<string> = computed(() => prettyDiffToHtml(toSafeJson(props.item), { indentSize: 2 }))
</script>

<template>
  <div class="d-flex flex-column gap-1">
    <h6 v-if="props.title" class="fw-semibold">{{ $t(props.title) }}</h6>
    <div class="code-block">
      <pre><code v-html="html"></code></pre>
    </div>
  </div>
</template>
