<script setup lang="ts" />

<template>
  <div id="navbar">
    <div id="top-nav">
      <div id="nav-slot">
        <slot name="left"></slot>
      </div>

      <div id="nav-slot">
        <slot name="center"></slot>
      </div>
      <div id="nav-slot">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>
