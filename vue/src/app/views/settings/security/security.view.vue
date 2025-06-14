<script setup lang="ts">
import SecurityLayout from './layouts/security.layout.vue'

import UpdateEmailComponent from './components/update-email.component.vue'
import UpdatePasswordComponent from './components/update-password.component.vue'
</script>

<template>
  <SecurityLayout>
    <template #update-email>
      <UpdateEmailComponent />
    </template>
    <template #update-password>
      <UpdatePasswordComponent />
    </template>
  </SecurityLayout>
</template>
