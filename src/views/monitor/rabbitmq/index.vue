<template>
  <div class="h-full">
    <iframe class="wh-full" :src="src"></iframe>
  </div>
</template>

<script setup lang="ts">
const src = 'http://localhost:15672/#/';
</script>
<style scoped></style>
