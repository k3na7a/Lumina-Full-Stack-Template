<script setup lang="ts">
import ProfileLayout from '../layouts/profile.layout.vue'
import UpdateProfileComponent from '../components/update-profile.component.vue'
import ProfilePictureComponent from '../components/update-avatar.component.vue'
import { useProfilePage } from '../composables/profile.composable'

const { user, updateAvatar, removeAvatar, updateProfile } = useProfilePage()
</script>

<template>
  <ProfileLayout>
    <template #profile-picture>
      <ProfilePictureComponent :user="user" :update-avatar="updateAvatar" :remove-avatar="removeAvatar" />
    </template>
    <template #update-profile>
      <UpdateProfileComponent :user="user" :callback="updateProfile" />
    </template>
  </ProfileLayout>
</template>
