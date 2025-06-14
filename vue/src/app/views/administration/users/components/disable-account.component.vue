<script setup lang="ts">
import { UserDto } from '@/library/apis/localhost/dto/user.dto'
import { UserAdminController } from '../controller/admin.user.controller'
import { Router, useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/app/router/routes'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const controller = new UserAdminController(t)

const $router: Router = useRouter()

const props = defineProps<{
  user: UserDto
}>()

function remove(_: MouseEvent): void {
  controller.deleteUser(props.user, (_: UserDto) => {
    $router.push({ name: ROUTE_NAMES.ADMIN_USERS })
  })
}
</script>

<template>
  <div class="d-flex flex-column flex-sm-row gap-3 p-3">
    <div class="row-header">
      <h6 class="fw-bold">
        {{ $t('administration.users.single.delete-account.label') }}
      </h6>
    </div>
    <div class="d-flex align-items-center justify-content-sm-end flex-grow-1">
      <button class="btn btn-link fw-normal" type="button" @click="remove">
        {{ $t('actions.disable-account') }}
      </button>
    </div>
  </div>
</template>
