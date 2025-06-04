<script setup lang="ts">
import ToastComponent from '@/app/components/toast/toast.component.vue'
import ModalComponent from '@/app/components/modal/modal.component.vue'
import ErrorBoundary from '@/app/components/error-boundary/error-boundary.component.vue'

import { provide, ref } from 'vue'
import { UpdateKeySymbol } from '@/library/data/schema/key.schema'

const renderKey = ref(Date.now())
const updateKey = () => (renderKey.value = Date.now())

provide(UpdateKeySymbol, updateKey)
</script>

<template>
  <RouterView v-slot="{ Component }" :key="renderKey">
    <template v-if="Component">
      <Suspense>
        <template #default>
          <ErrorBoundary>
            <component :is="Component" />
            <template #error>
              {{ $t('forms.error-general') }}
            </template>
          </ErrorBoundary>
        </template>
        <template #fallback>
          {{ $t('actions.loading') }}
        </template>
      </Suspense>
    </template>
  </RouterView>

  <ModalComponent />
  <ToastComponent />
</template>
