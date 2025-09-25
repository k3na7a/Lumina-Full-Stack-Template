<script setup lang="ts">
import { AuditEventDto } from '@lib/dto/audit.dto'

import ModalTitle from '@/shared/components/modal/base/modal-title.component.vue'
import Layout from '../layouts/event.layout.vue'
import { computed } from 'vue'
import { prettyDiffToHtml, toSafeJson } from '@lib/utilities/object.util'

const props = defineProps<{ title: string; event: AuditEventDto }>()

const { diff, before, after, metadata, ...details } = props.event

const details_html = computed(() => prettyDiffToHtml(toSafeJson(details), { indentSize: 2 }))
const before_html = computed(() => prettyDiffToHtml(before, { indentSize: 2 }))
const after_html = computed(() => prettyDiffToHtml(after, { indentSize: 2 }))
const diff_html = computed(() => prettyDiffToHtml(diff, { indentSize: 2 }))
const meta_html = computed(() => prettyDiffToHtml(metadata, { indentSize: 2 }))
</script>

<template>
  <Layout>
    <template #title>
      <ModalTitle :title="$t(props.title)" />
    </template>
    <template #info>
      <div class="code-block">
        <pre><code v-html="details_html"></code></pre>
      </div>
    </template>
    <template #before>
      <div class="code-block">
        <pre><code v-html="before_html"></code></pre>
      </div>
    </template>
    <template #after>
      <div class="code-block">
        <pre><code v-html="after_html"></code></pre>
      </div>
    </template>
    <template #diff>
      <div class="code-block">
        <pre><code v-html="diff_html"></code></pre>
      </div>
    </template>
    <template #metadata>
      <div class="code-block">
        <pre><code v-html="meta_html"></code></pre>
      </div>
    </template>
  </Layout>
</template>
