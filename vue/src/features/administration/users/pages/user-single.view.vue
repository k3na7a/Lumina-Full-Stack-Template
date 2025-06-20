<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUserAdminHandler } from '../handlers/user.handler'
import { UserDto } from '@/core/apis/dto/user.dto'

import UpdateUserAvatar from '../components/update-user-avatar.component.vue'
import DisableAccountComponent from '../components/disable-account.component.vue'
import UserModal from '../components/update-user-profile.component.vue'

import SingleLayout from '../layouts/user-single.layout.vue'

const { t } = useI18n()
const handler = useUserAdminHandler(t)

const $route = useRoute()
const id = $route.params.id as string
const user = ref<UserDto>(null!)

function setUser(newUser: UserDto): void {
  user.value = newUser
}

await handler.getById(id).then((value: UserDto) => {
  user.value = value
})
</script>

<template>
  <div class="content-view-settings">
    <SingleLayout>
      <template #update-profile>
        <UserModal :user :callback="setUser" />
      </template>
      <template #update-avatar>
        <UpdateUserAvatar :user :callback="setUser" />
      </template>
      <template #disable-account>
        <DisableAccountComponent :user="user" />
      </template>
    </SingleLayout>
  </div>
</template>
