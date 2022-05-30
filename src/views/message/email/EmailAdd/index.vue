<template>
  <n-drawer v-model:show="obj.showDrawer" :width="502" placement="left">
    <n-drawer-content :title="obj.updateEmailInfo ? `编辑` : '新增邮箱'">
      <n-space vertical :size="28">
        <n-space vertical :size="14">
          <n-text> 用户名 </n-text>
          <n-select
            v-model:value="obj.bindUserUid"
            filterable
            placeholder="搜索用户"
            :options="obj.userOptions"
            :loading="obj.loading"
            clearable
            remote
            @search="handleSearch"
          />
        </n-space>

        <n-space vertical :size="14">
          <n-text> 邮箱号 </n-text>
          <n-input
            v-model:value="obj.currentEmailInfo.email"
            :minlength="4"
            :maxlength="254"
            round
            placeholder="email"
          />
        </n-space>

        <n-space vertical :size="14">
          <n-text> 邮箱主机号 </n-text>
          <n-input
            v-model:value="obj.currentEmailInfo.emailHost"
            :minlength="2"
            :maxlength="20"
            round
            placeholder="emailHost"
          />
        </n-space>

        <n-space vertical :size="14">
          <n-text> 邮箱密码 </n-text>
          <n-input disabled value="暂时不需要" round placeholder="password" />
        </n-space>

        <n-space vertical :size="14">
          <n-text> 邮箱协议 </n-text>
          <n-input v-model:value="obj.currentEmailInfo.protocol" round placeholder="protocol" />
        </n-space>

        <n-space vertical :size="14">
          <n-text> 端口 </n-text>
          <n-input v-model:value="obj.currentEmailInfo.port" round placeholder="port" />
        </n-space>

        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: right">
              <n-button round type="primary" @click="handleSaveEmailInfo">
                {{ obj.updateEmailInfo ? '更新' : '添加' }}
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-space>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useMessage, FormInst, FormItemInst, FormItemRule, FormRules } from 'naive-ui';
import { REGEXP_EMAIL } from '@/config';
import { useAuthStore } from '@/store';
import { bindEmailForUser, updateUser, addUser, fetchAllUser, updateEmailByUid, insertEmail } from '@/service';
import emitter from '@/utils/mitt';
import { User } from '@/theme';
import { Email } from '@/theme/message';

const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const message = useMessage();
const auth = useAuthStore();

class UserOption {
  label?: string;

  value?: string;

  constructor(label: string, value: string) {
    this.label = label;
    this.value = value;
  }
}

const obj = reactive({
  showDrawer: false,
  updateEmailInfo: false,
  currentEmailInfo: new Email(),
  emailPrefix: '',
  validator: false,
  bindEmailLoadingStatus: false,
  loading: false,
  userOptions: new Array<UserOption>(),
  bindUserUid: ''
});

const reloadDataStatus = ref(false);

onMounted(() => {
  emitter.on('clickModifyEmailInfo', e => {
    obj.showDrawer = true;
    obj.updateEmailInfo = e.updateEmailInfo;
    obj.currentEmailInfo = e.currentEmailInfo;
    obj.bindUserUid = obj.currentEmailInfo.userUid as string;
  });
});

watch(reloadDataStatus, (nV, oV) => {
  // 重新加载数据
  if (nV) {
    emitter.emit('reloadEmailData');
  }
});

const handleSearch = (query: string) => {
  if (!query.length) {
    obj.userOptions = [];
    return;
  }
  obj.loading = true;

  // 搜索用户信息
  fetchAllUser({ keyword: query }).then(data => {
    if (data.success) {
      data.data.result.forEach(value => {
        obj.userOptions.push(new UserOption(value.username as string, value.uid as string));
        obj.loading = false;
      });
    }
  });
};

const handleSaveEmailInfo = () => {
  if (!obj.bindUserUid) {
    message.error('必须指定用户');
    return;
  }
  if (obj.currentEmailInfo.port) {
    if (!/^[0-9]*/.test(obj.currentEmailInfo.port)) {
      message.error('端口必须是数字');
      obj.currentEmailInfo.port = 0;
      return;
    }
  }

  if (!REGEXP_EMAIL.test(obj.currentEmailInfo.email)) {
    message.error('邮箱不符合要求');
    obj.currentEmailInfo.email = '';
    return;
  }

  obj.currentEmailInfo.userUid = obj.bindUserUid;

  if (obj.updateEmailInfo) {
    // 更新操作
    updateEmailByUid(obj.currentEmailInfo).then(data => {
      if (data.success) {
        message.success('更新成功');
        reloadDataStatus.value = true;
      }
    });
  } else {
    // 添加
    insertEmail(obj.currentEmailInfo).then(data => {
      if (data.success) {
        message.success('插入成功');
        reloadDataStatus.value = true;
      }
    });
  }
};
</script>

<style scoped lang="less">
.user-avatar {
  margin: 0 auto;
  text-align: center;
}
</style>
