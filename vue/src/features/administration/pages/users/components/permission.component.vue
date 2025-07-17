<script setup lang="ts">
import { Form } from 'vee-validate'

import TextInput from '@/shared/components/inputs/text.input.vue'
import Layout from '../layouts/update-permission.layout.vue'
import ModalTitle from '@/shared/components/modal/base/modal-title.component.vue'
import SelectInput from '@/shared/components/inputs/select.input.vue'

import { usePermissionForm, proptype } from '../composables/permission.composable'
import { PermissionDomain } from '@/../../library/constants/permissions.constants'

const props = defineProps<proptype>()
const { onSubmit, initialValues, validationSchema, loading } = usePermissionForm(props)
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

      <template #domain>
        <SelectInput name="domain" :options="Object.values(PermissionDomain)">
          <template #option="{ option }">
            {{ option }}
          </template>
        </SelectInput>
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
