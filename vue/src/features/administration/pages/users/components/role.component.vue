<script setup lang="ts">
import { Form } from 'vee-validate'

import TextInput from '@/shared/components/inputs/text.input.vue'
import Layout from '../layouts/update-role.layout.vue'
import ModalTitle from '@/shared/components/modal/base/modal-title.component.vue'
import SearchPaginatedInput from '@/shared/components/inputs/search-paginated-input.input.vue'
import { defaultOptions } from '../composables/permissions-table.composable'
import { useRoleForm, proptype } from '../composables/role.composable'

const props = defineProps<proptype>()
const { onSubmit, initialValues, validationSchema, loading, getPermissions } = useRoleForm(props)
const { title } = props
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" :initial-values="initialValues" v-slot="{ meta }">
    <Layout>
      <template #title>
        <ModalTitle :title="$t(title)" />
      </template>
      <template #name>
        <TextInput
          name="name"
          type="text"
          :placeholder="$t('administration.user-management.roles.placeholders.name')"
        />
      </template>
      <template #label>
        <TextInput
          name="label"
          type="text"
          :placeholder="$t('administration.user-management.roles.placeholders.label')"
        />
      </template>
      <template #description>
        <TextInput
          name="description"
          type="text"
          :placeholder="$t('administration.user-management.roles.placeholders.description')"
        />
      </template>
      <template #permissions>
        <SearchPaginatedInput name="permissions" :callback="getPermissions" :options="defaultOptions">
          <template #option="{ option }">
            <div class="d-flex gap-2">
              <small class="text-primary">{{ option.domain }}</small>
              <small> {{ option.name.toUpperCase() }}</small>
              <small class="text-muted fst-italic">{{ option.id }}</small>
            </div>
          </template>
        </SearchPaginatedInput>
      </template>

      <template #submit>
        <button :disabled="!meta.valid || !meta.dirty || loading" class="btn btn-primary px-0" type="submit">
          <div class="containter">
            {{ $t('actions.save-changes') }}
          </div>
        </button>
      </template>
    </Layout>
  </Form>
</template>
