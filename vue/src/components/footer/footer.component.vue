<script setup lang="ts" />

<template>
  <div id="footer-secondary" class="align-items-stretch wrapper">
    <div class="d-flex"></div>
    <div class="d-flex">
      <div class="d-flex flex-grow-1 align-items-center">
        {{ $t('footer.legal', { year: new Date().getFullYear() }) }}
      </div>
    </div>
  </div>
</template>
