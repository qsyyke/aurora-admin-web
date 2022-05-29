<template>
  <div>
    <user-list />
    <user-add />
    <user-modify />
  </div>
</template>

<script lang="ts" setup>
import { UserList, UserModify, UserAdd } from '@/views/users/user/index';
</script>
<style scoped></style>
