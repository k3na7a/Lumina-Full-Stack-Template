<script setup lang="ts">
import { ComputedRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { AuthStore, useAuthStore } from '@/core/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'

import SecurityLayout from '../layouts/security.layout.vue'
import UpdateEmailComponent from '../components/update-email.component.vue'
import UpdatePasswordComponent from '../components/update-password.component.vue'
import DisableAccountComponent from '../components/delete-account.component.vue'
import { useSettingsHandler } from '../handlers/settings.handler'

const authStore: AuthStore = useAuthStore()
const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)

const { t } = useI18n()
const { disableAccount, updateEmail, updatePassword } = useSettingsHandler(t)
</script>

<template>
  <SecurityLayout>
    <template #update-email>
      <UpdateEmailComponent v-if="user" :user="user" :callback="updateEmail" />
    </template>
    <template #update-password>
      <UpdatePasswordComponent v-if="user" :user="user" :callback="updatePassword" />
    </template>
    <template #disable-account>
      <DisableAccountComponent :callback="disableAccount" />
    </template>
  </SecurityLayout>
</template>
