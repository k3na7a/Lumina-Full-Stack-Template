<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ComputedRef } from 'vue'

import { AuthStore, useAuthStore } from '@/core/store/authentication.store'

import { UserDto } from '@/library/dto/user.dto'

import ProfileLayout from '../layouts/profile.layout.vue'
import UpdateProfileComponent from '../components/update-profile.component.vue'
import ProfilePictureComponent from '../components/update-avatar.component.vue'
import { useSettingsHandler } from '../handlers/settings.handler'

const authStore: AuthStore = useAuthStore()
const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)

const { t } = useI18n()
const { updateAvatar, removeAvatar, updateProfile } = useSettingsHandler(t)
</script>

<template>
  <ProfileLayout>
    <template #profile-picture>
      <ProfilePictureComponent v-if="user" :user="user" :update-avatar="updateAvatar" :remove-avatar="removeAvatar" />
    </template>
    <template #update-profile>
      <UpdateProfileComponent v-if="user" :user="user" :callback="updateProfile" />
    </template>
  </ProfileLayout>
</template>
