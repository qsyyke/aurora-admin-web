<template>
  <n-card title="歌曲" style="margin-bottom: 16px">
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="信息">
        <user-info />
      </n-tab-pane>
      <n-tab-pane name="the beatles" tab="系统"> 系统 </n-tab-pane>
      <n-tab-pane name="jay chou" tab="安全">
        <user-security />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script lang="ts" setup>
import { UserSecurity, UserInfo } from '@/views/users/profile/index';
</script>
