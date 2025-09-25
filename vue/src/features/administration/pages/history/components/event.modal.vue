<script setup lang="ts">
import { AuditEventDto } from '@lib/dto/audit.dto'

import ModalTitle from '@/shared/components/modal/base/modal-title.component.vue'
import Layout from '../layouts/event.layout.vue'
import { computed } from 'vue'
import { prettyDiffToHtml } from '@lib/utilities/object.util'

const props = defineProps<{ title: string; event: AuditEventDto }>()
const html = computed(() => prettyDiffToHtml(props.event.diff, { indentSize: 2 }))
</script>

<template>
  <Layout>
    <template #title>
      <ModalTitle :title="$t(props.title)" />
    </template>
    <template #diff>
      <div class="code-block">
        <pre><code v-html="html"></code></pre>
      </div>
    </template>
  </Layout>
</template>
