<script setup lang="ts">
import { provide, ref } from 'vue'

import { UpdateKeySymbol } from './schema/update-key.schema'

import ToastComponent from '@/shared/components/toast/toast.component.vue'
import ModalComponent from '@/shared/components/modal/modal.component.vue'
import ErrorBoundary from '@/shared/components/error-boundary/error-boundary.v1.component.vue'

const renderKey = ref(Date.now())
const updateKey = () => (renderKey.value = Date.now())

provide(UpdateKeySymbol, updateKey)
</script>

<template>
  <RouterView v-slot="{ Component }" :key="renderKey">
    <template v-if="Component">
      <ErrorBoundary>
        <Suspense>
          <template #default>
            <component :is="Component" />
          </template>
          <template #fallback>
            {{ $t('actions.loading') }}
          </template>
        </Suspense>
        <template #error>
          {{ $t('forms.error-general') }}
        </template>
      </ErrorBoundary>
    </template>
  </RouterView>

  <ModalComponent />
  <ToastComponent />
</template>
