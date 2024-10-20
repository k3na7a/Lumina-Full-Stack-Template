<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import { getMonthDetails, months, days } from '@/library/utilities/helpers/date.util'

import * as bootstrap from 'bootstrap'
import moment from 'moment'
import { useField } from 'vee-validate'

const props = defineProps<{ name: string; value?: Date }>()
const todayTimestamp = moment().startOf('day')

const date = new Date()
const year = ref<number>(date.getFullYear())
const month = ref<number>(date.getMonth())

const name = toRef(props, 'name')
const { value, errorMessage } = useField<Date | undefined>(name.value, undefined, {
  initialValue: undefined
})

const emit = defineEmits<{ update: [value: Date | undefined] }>()
watch(value, (newVal: Date | undefined) => {
  emit('update', newVal)
})

onMounted(() => {
  emit('update', value.value)
})

const dropdownRef = ref<InstanceType<typeof HTMLElement>>()
function closeDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}

function toggleDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.toggle()
}

function reset(): void {
  if (value.value) {
    year.value = value.value.getFullYear()
    month.value = value.value.getMonth()
  } else {
    year.value = date.getFullYear()
    month.value = date.getMonth()
  }
}

function clear(): void {
  value.value = undefined
  closeDropdown()
}

function set(event: MouseEvent): void {
  const target = event.target as HTMLButtonElement
  value.value = new Date(parseInt(target.id))
  closeDropdown()
}

function setToday(): void {
  value.value = todayTimestamp.toDate()
  closeDropdown()
}

function getMonthStr(month: number): string {
  return months[Math.max(Math.min(11, month), 0)]
}

function updateYear(offset: number): void {
  year.value = year.value + offset
}

function updateMonth(offset: number): void {
  month.value = month.value + offset

  if (month.value === -1) {
    month.value = 11
    year.value--
  } else if (month.value === 12) {
    month.value = 0
    year.value++
  }
}

onMounted(() => {
  dropdownRef.value?.addEventListener('hidden.bs.dropdown', reset)
})
onUnmounted(() => {
  dropdownRef.value?.removeEventListener('hidden.bs.dropdown', reset)
})
</script>

<template>
  <div class="custom-input" v-click-outside="closeDropdown">
    <div class="dropdown date-picker border-0" ref="dropdownRef">
      <button
        class="date-picker-btn bg-alt text-light w-100 d-flex align-items-stretch"
        :class="{ 'has-error': !!errorMessage }"
        @click="toggleDropdown"
        type="button"
      >
        <div class="d-flex flex-grow-1 d-flex text-start px-2 align-items-center overflow-hidden">
          <span v-if="value">{{ moment(value).format('MMMM Do YYYY') }}</span>
          <span v-else style="color: grey">select a date...</span>
        </div>
        <div class="d-flex align-items-center px-2">
          <font-awesome-icon size="sm" :icon="['far', 'calendar']" />
        </div>
      </button>
      <div
        @click="($event: MouseEvent) => $event.stopPropagation()"
        class="dropdown-menu mt-0 p-0 text-center text-light-alt p-2"
      >
        <div class="d-flex justify-content-between align-items-center my-1">
          <div class="d-flex gap-1">
            <button class="text-light btn btn-icon btn-dark border-0" @click="() => updateYear(-1)" type="button">
              <font-awesome-icon :icon="['fas', 'angles-left']" />
            </button>
            <button class="text-light btn btn-icon btn-dark border-0" @click="() => updateMonth(-1)" type="button">
              <font-awesome-icon :icon="['fas', 'angle-left']" />
            </button>
          </div>
          <h6>{{ getMonthStr(month) }} {{ year }}</h6>
          <div class="d-flex gap-1">
            <button class="text-light btn btn-icon btn-dark border-0" @click="() => updateMonth(1)" type="button">
              <font-awesome-icon :icon="['fas', 'angle-right']" />
            </button>
            <button class="text-light btn btn-icon btn-dark border-0" @click="() => updateYear(1)" type="button">
              <font-awesome-icon :icon="['fas', 'angles-right']" />
            </button>
          </div>
        </div>
        <div class="d-flex flex-column gap-2">
          <div class="calendar d-flex flex-column" :key="`${month}/${year}`">
            <div class="d-flex border-bottom border-secondary">
              <div v-for="(_, idx) of Array(7)" class="col p-1" :key="`header:${days[idx]}`">
                <small class="text-grey fw-semibold">{{ days[idx].substring(0, 3).toUpperCase() }}</small>
              </div>
            </div>
            <div v-for="(_, idx) of Array(6)" class="d-flex" :key="`row:${idx}`">
              <div
                v-for="(day, i) of getMonthDetails(year, month).slice(idx * 7, (idx + 1) * 7)"
                class="col"
                :key="`row:${idx}:col:${i}`"
              >
                <button
                  :id="day.timestamp.toString()"
                  type="button"
                  @click="set"
                  :disabled="value?.getTime() == day.timestamp"
                  style="width: 4rem; height: 4rem"
                  class="text-light-alt dropdown-item p-0 d-flex justify-content-center align-items-center"
                  :class="{
                    'd-none': day.month,
                    'text-decoration-underline link-offset-2': todayTimestamp.toDate().getTime() == day.timestamp,
                    active: value?.getTime() == day.timestamp
                  }"
                >
                  {{ day.date }}
                </button>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between gap-2">
            <div class="col">
              <button class="btn btn-link fw-normal" type="button" @click="clear">
                {{ $t('actions.clear') }}
              </button>
            </div>
            <div class="col">
              <button class="btn btn-link fw-normal" type="button" @click="setToday">
                {{ $t('forms.today') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.dropdown.date-picker {
  .date-picker-btn {
    border: 0.1rem $muted solid;
    outline: none;
    height: 3rem;
    transition: all 0.15s ease-in-out;
  }

  &:hover {
    .date-picker-btn {
      box-shadow: 0 0 0 0.1rem $muted;

      &.has-error {
        box-shadow: 0 0 0 0.1rem $danger !important;
      }
    }
  }

  &:focus-within {
    .date-picker-btn {
      border-color: $primary;
      box-shadow: 0 0 0 0.1rem $primary;

      &.has-error {
        box-shadow: 0 0 0 0.1rem $danger !important;
      }
    }
  }

  .has-error {
    border-color: $danger !important;
  }

  .dropdown-menu {
    border: 0.1rem $muted solid;
    min-width: fit-content;

    button {
      margin: 0;
    }
  }
}
</style>
