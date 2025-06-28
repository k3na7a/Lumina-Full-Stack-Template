<script setup lang="ts">
import { provide, ref } from 'vue'

import ToastComponent from '@/shared/components/toast/toast.component.vue'
import ModalComponent from '@/shared/components/modal/base/modal.component.vue'
import ErrorBoundary from '@/shared/components/error-boundary/error-boundary.v1.component.vue'

const UpdateKeySymbol = Symbol('updateKey')
type UpdateKeyFn = () => void

const renderKey = ref(Date.now())
const updateKey: UpdateKeyFn = () => (renderKey.value = Date.now())

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
