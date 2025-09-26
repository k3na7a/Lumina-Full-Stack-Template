<script setup lang="ts">
import ModalTitle from '@/shared/components/modal/base/modal-title.component.vue'
import { prettyDiffToHtml, toSafeJson } from '@lib/utilities/object.util'
import { computed, ComputedRef } from 'vue'

const props = defineProps<{ item: Record<string, unknown>; title: string }>()

const html: ComputedRef<string> = computed(() => prettyDiffToHtml(toSafeJson(props.item), { indentSize: 2 }))
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <ModalTitle :title="$t(props.title)" />

    <div class="d-flex flex-column gap-1">
      <div class="code-block">
        <pre><code v-html="html"></code></pre>
      </div>
    </div>
  </div>
</template>
