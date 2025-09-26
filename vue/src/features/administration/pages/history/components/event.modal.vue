<script setup lang="ts">
import { AuditEventDto } from '@lib/dto/audit.dto'

import ModalTitle from '@/shared/components/modal/base/modal-title.component.vue'
import Layout from '../layouts/event.layout.vue'
import { useActivitiesModal } from '../composables/activities-modal.composable'

const props = defineProps<{ title: string; event: AuditEventDto }>()

const { $diff, $before, $after, $meta, $details } = useActivitiesModal(props)
</script>

<template>
  <Layout>
    <template #title>
      <ModalTitle :title="$t(props.title)" />
    </template>
    <template #info>
      <div class="code-block">
        <pre><code v-html="$details"></code></pre>
      </div>
    </template>
    <template #before>
      <div class="code-block">
        <pre><code v-html="$before"></code></pre>
      </div>
    </template>
    <template #after>
      <div class="code-block">
        <pre><code v-html="$after"></code></pre>
      </div>
    </template>
    <template #diff>
      <div class="code-block">
        <pre><code v-html="$diff"></code></pre>
      </div>
    </template>
    <template #metadata>
      <div class="code-block">
        <pre><code v-html="$meta"></code></pre>
      </div>
    </template>
  </Layout>
</template>
