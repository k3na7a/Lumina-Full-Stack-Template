<script setup lang="ts">
import { Form } from 'vee-validate'

import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { generateUrlSlug } from '@/core/utils/slug.util'

import TextInput from '@/shared/components/inputs/text.input.vue'
import FileInput from '@/shared/components/inputs/file.input.vue'
import DateInput from '@/shared/components/inputs/date.input.vue'
import TextAreaInput from '@/shared/components/inputs/text-area.input.vue'
import SearchPaginatedInput from '@/shared/components/inputs/search-paginated-input.input.vue'

import Layout from '../layouts/game.layout.vue'
import { proptype, useGameForm } from '../composables/game.composable'

const props = defineProps<proptype>()
const { onSubmit, initialValues, validationSchema, loading, platformOptions } = useGameForm(props)
</script>

<template>
  <Form
    @submit="onSubmit"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    v-slot="{ meta, values }"
  >
    <Layout>
      <template #name>
        <TextInput
          name="name"
          type="text"
          :placeholder="$t('administration.games-and-software.games.create.form.placeholders.name')"
        />
      </template>
      <template #cover>
        <FileInput name="cover" />
      </template>
      <template #release_date>
        <DateInput name="release_date" />
      </template>
      <template #description>
        <TextAreaInput
          name="description"
          :rows="6"
          :placeholder="$t('administration.games-and-software.games.create.form.placeholders.description')"
        />
      </template>
      <template #platforms>
        <SearchPaginatedInput
          name="platforms"
          :callback="LocalhostAPI.administration.platforms.getPaginated"
          :options="platformOptions"
        >
          <template #option="{ option }">
            {{ option.name }}
            <small class="ms-2 text-muted fst-italic">{{ option.id }}</small>
          </template>
        </SearchPaginatedInput>
      </template>
      <template #slug>
        <TextInput
          :value="generateUrlSlug(values.name)"
          name="slug"
          label="forms.slug"
          type="text"
          :placeholder="$t('administration.games-and-software.games.create.form.placeholders.slug')"
        />
      </template>

      <template #submit>
        <button :disabled="!meta.valid || loading" class="btn btn-primary px-0" type="submit">
          <div class="containter">
            {{ $t('administration.games-and-software.games.create.action') }}
          </div>
        </button>
      </template>
    </Layout>
  </Form>
</template>
