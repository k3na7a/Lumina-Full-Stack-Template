<script setup lang="ts">
import { LocalhostAPI } from '@/core/apis'
import OverviewLayout from '../layouts/overview.layout.vue'
import { ref } from 'vue'
import { HealthResponseDto } from '@lib/dto/health.dto'
import CodeBlockWidget from '@/shared/components/modal/widgets/code-block.widget.vue'

const health = ref<HealthResponseDto>({} as HealthResponseDto)
await LocalhostAPI.health.healthCheck().then((res) => (health.value = res))
</script>

<template>
  <OverviewLayout>
    <CodeBlockWidget :item="health.services.system" />
  </OverviewLayout>
</template>
