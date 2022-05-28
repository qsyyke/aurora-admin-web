<template>
  <n-drawer v-model:show="showDrawer" :width="502" placement="left">
    <n-drawer-content title="斯通纳"> 《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。</n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, reactive } from 'vue';
import { useMessage } from 'naive-ui';
import emitter from '@/utils/mitt';
import { User } from '@/theme';

const showDrawer = ref(false);

const updateUserInfo = () => {};

let currentUser = reactive(new User());

onMounted(() => {
  emitter.on('clickModifyUserInfo', e => {
    currentUser = e as User;
  });
});
</script>
