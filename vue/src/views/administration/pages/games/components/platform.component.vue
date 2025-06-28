<script setup lang="ts">
import { computed, ref } from 'vue'
import { Form } from 'vee-validate'

import { useFormUtil } from '@/core/utils/forms.util'
import { validationSchema } from '../schema/platforms.schema'

import TextInput from '@/shared/components/inputs/text.input.vue'
import DateInput from '@/shared/components/inputs/date.input.vue'

import Layout from '../layouts/platform.layout.vue'
import { PlatformDto } from '@/core/apis/dto/platform.dto'

const props = defineProps<{
  platform?: PlatformDto
  callback: (values: any) => Promise<void>
}>()

const validateUtil = useFormUtil()
const loading = ref<boolean>(false)

const initialValues = computed(() => ({
  name: props.platform?.name,
  release_date: props.platform?.release_date,
  slug: props.platform?.slug
}))

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: object) => {
  loading.value = true
  await props.callback(values).finally(() => {
    loading.value = false
  })
})
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
        <TextInput name="name" type="text" :placeholder="$t('Nintendo Entertainment System')" />
      </template>

      <template #release_date>
        <DateInput name="release_date" />
      </template>

      <template #slug>
        <TextInput
          :value="
            values.name
              ?.replace(/[^a-zA-Z0-9 ]/g, ' ')
              .trim()
              .replace(/\W+/g, '-')
              .toLowerCase()
          "
          name="slug"
          label="forms.slug"
          type="text"
          :placeholder="$t('nintendo-entertainment-system')"
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
