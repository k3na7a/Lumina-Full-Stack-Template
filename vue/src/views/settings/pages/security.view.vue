<script setup lang="ts">
import SecurityLayout from '../layouts/security.layout.vue'
import UpdateEmailComponent from '../components/update-email.component.vue'
import UpdatePasswordComponent from '../components/update-password.component.vue'
import DisableAccountComponent from '../components/delete-account.component.vue'
import { useSecurityPage } from '../composables/security.composable'

const { disableAccount, updateEmail, updatePassword, user } = useSecurityPage()
</script>

<template>
  <SecurityLayout>
    <template #update-email>
      <UpdateEmailComponent :user="user" :callback="updateEmail" />
    </template>
    <template #update-password>
      <UpdatePasswordComponent :user="user" :callback="updatePassword" />
    </template>
    <template #disable-account>
      <DisableAccountComponent :callback="disableAccount" />
    </template>
  </SecurityLayout>
</template>
