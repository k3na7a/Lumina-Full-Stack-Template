<script setup lang="ts">
import moment from 'moment'

import { getMonthDetails } from '@lib/utilities/date.util'

import { days } from '@lib/constants/date.constants'
import { useDateInput } from './composables/date-input.composable'

const props = defineProps<{ name: string; value?: Date }>()
const emit = defineEmits<{ update: [value: Date | undefined] }>()

const {
  value,
  month,
  year,
  todayTimestamp,
  dropdownRef,
  closeDropdown,
  toggleDropdown,
  clear,
  set,
  setToday,
  errorMessage,
  updateMonth,
  updateYear,
  getMonthStr
} = useDateInput(props, emit)
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
