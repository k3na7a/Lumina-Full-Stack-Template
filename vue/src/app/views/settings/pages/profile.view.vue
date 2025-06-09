<script setup lang="ts">
import UpdateProfileComponent from '../components/update-profile.component.vue'
import DisableAccountComponent from '../components/disable-account.component.vue'
import ProfilePictureComponent from '../components/update-avatar.component.vue'

import ProfileLayout from '../layouts/profile.layout.vue'
</script>

<template>
  <ProfileLayout>
    <template #profile-picture>
      <ProfilePictureComponent />
    </template>
    <template #update-profile>
      <UpdateProfileComponent />
    </template>
    <template #disable-account>
      <DisableAccountComponent />
    </template>
  </ProfileLayout>
</template>
