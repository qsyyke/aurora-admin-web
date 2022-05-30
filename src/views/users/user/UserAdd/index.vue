<template>
  <n-drawer v-model:show="obj.showDrawer" :width="502" placement="left">
    <n-drawer-content :title="obj.updateUserInfo ? `编辑` : '新增用户'">
      <n-space vertical hoverable>
        <n-card hoverable class="rounded-16px shadow-sm" size="small">
          <div class="user-avatar">
            <n-avatar
              v-if="obj.updateUserInfo && obj.currentUserInfo.avatar"
              round
              :size="100"
              :src="obj.currentUserInfo.avatar"
            />
            <n-avatar v-else :size="100" round>{{ obj.currentUserInfo.username }}</n-avatar>
          </div>
          <n-form ref="formRef" :model="obj.currentUserInfo" :rules="rules">
            <n-form-item path="username" label="用户名">
              <n-input v-model:value="obj.currentUserInfo.username" :round="true" @keydown.enter.prevent />
            </n-form-item>

            <n-form-item v-if="!obj.updateUserInfo" path="password" label="密码">
              <n-input
                v-model:value="obj.currentUserInfo.password"
                :round="true"
                type="password"
                @keydown.enter.prevent
              />
            </n-form-item>

            <n-form-item path="nickname" label="昵称">
              <n-input v-model:value="obj.currentUserInfo.nickname" :round="true" />
            </n-form-item>

            <n-form-item path="email" label="邮箱">
              <n-input v-model:value="obj.currentUserInfo.email.email" :round="true" />
            </n-form-item>
          </n-form>
        </n-card>
        <n-card hoverable class="rounded-16px shadow-sm" size="small">
          <n-grid x-gap="12" :cols="2">
            <n-gi>
              <n-tag checkable>邮箱绑定状态</n-tag>
            </n-gi>
            <n-gi>
              <n-switch
                :value="obj.currentUserInfo.verifyEmail"
                :loading="obj.bindEmailLoadingStatus"
                @update:value="handleBindEmail"
              />
            </n-gi>
          </n-grid>
          <n-divider />
          <n-grid x-gap="12" :cols="2">
            <n-gi>
              <n-tag checkable>账户状态</n-tag>
            </n-gi>
            <n-gi>
              <n-switch v-model:value="obj.currentUserInfo.accountLock" />
            </n-gi>
          </n-grid>
          <n-divider />
          <n-grid x-gap="12" :cols="2">
            <n-gi>
              <n-tag checkable>删除</n-tag>
            </n-gi>
            <n-gi>
              <n-switch v-model:value="obj.currentUserInfo.delete" />
            </n-gi>
          </n-grid>

          <n-divider v-if="obj.updateUserInfo" />
          <n-grid v-if="obj.updateUserInfo" x-gap="12" :cols="2">
            <n-gi>
              <n-tag checkable>创建时间</n-tag>
            </n-gi>
            <n-gi>
              <n-tag checkable>{{ obj.currentUserInfo.createTime }}</n-tag>
            </n-gi>
          </n-grid>

          <n-divider v-if="obj.updateUserInfo" />
          <n-grid v-if="obj.updateUserInfo" x-gap="12" :cols="2">
            <n-gi>
              <n-tag checkable>最后更新时间</n-tag>
            </n-gi>
            <n-gi>
              <n-tag checkable>{{ obj.currentUserInfo.updateTime }}</n-tag>
            </n-gi>
          </n-grid>
        </n-card>

        <n-card hoverable class="rounded-16px shadow-sm" size="small">
          <n-space vertical>
            <n-tabs type="line" animated>
              <n-tab-pane name="oasis" tab="描述">
                {{ obj.currentUserInfo.userSummary === undefined ? '暂时无数据' : obj.currentUserInfo.userSummary }}
              </n-tab-pane>
              <n-tab-pane name="the beatles" tab="专业">
                {{ obj.currentUserInfo.profession === undefined ? '暂时无数据' : obj.currentUserInfo.profession }}
              </n-tab-pane>
            </n-tabs>

            <n-row :gutter="[0, 24]">
              <n-col :span="24">
                <div style="display: flex; justify-content: flex-end">
                  <n-button :disabled="obj.validator" round type="primary" @click="handleValidateButtonClick">
                    {{ obj.updateUserInfo ? '更新' : '添加' }}
                  </n-button>
                </div>
              </n-col>
            </n-row>
          </n-space>
        </n-card>
      </n-space>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useMessage, FormInst, FormItemInst, FormItemRule, FormRules } from 'naive-ui';
import { useAuthStore } from '@/store';
import { bindEmailForUser, updateUser, addUser } from '@/service';
import { getUserInfo, setUserInfo } from '@/utils';
import emitter from '@/utils/mitt';
import { User } from '@/theme';
import { Email } from '@/theme/message';

const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const message = useMessage();
const auth = useAuthStore();

const obj = reactive({
  showDrawer: false,
  updateUserInfo: false,
  currentUserInfo: new User(),
  emailPrefix: '',
  validator: false,
  bindEmailLoadingStatus: false
});
if (obj.currentUserInfo.email === null || obj.currentUserInfo.email === undefined) {
  obj.currentUserInfo.email = new Email();
}

const reloadDataStatus = ref(false);

const rules: FormRules = {
  username: [
    {
      required: false,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('你没有输入用户名😯');
        }
        if (!/^[a-zA-Z0-9-]{3,15}$/.test(value)) {
          return new Error('用户名长度为3到15，不含特殊字符(除-外)');
        }
        return true;
      }
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ]
};

const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate(errors => {
    if (errors) {
      obj.validator = true;
      message.error('请输入合法信息');
      setTimeout(() => {
        obj.validator = false;
      }, 1500);
    } else {
      obj.validator = false;
      // 发送请求之前，绑定邮箱状态设置null
      obj.currentUserInfo.verifyEmail = null;

      // 如果是添加用户
      if (!obj.updateUserInfo) {
        addUser(obj.currentUserInfo).then(data => {
          if (data.success) {
            // 添加成功
            message.success(`添加 ${obj.currentUserInfo.username} 成功`);
            reloadDataStatus.value = true;
          }
        });
      } else {
        // 更新用户信息
        updateUser(obj.currentUserInfo).then(data => {
          if (data.success) {
            // 修改成功
            message.success(`修改 ${obj.currentUserInfo.username} 成功`);
            reloadDataStatus.value = true;

            // 如果修改的用户信息就是当前登录用户，则重新存储用户信息
            if (auth.getUserInfo.uid === obj.currentUserInfo.uid) {
              auth.updateUserinfo();
            }
          }
        });
      }
    }
  });
};

onMounted(() => {
  emitter.on('clickModifyUserInfo', e => {
    obj.showDrawer = true;
    obj.updateUserInfo = e.updateUserInfo;
    obj.currentUserInfo = e.currentUserInfo;

    if (obj.currentUserInfo.email === null || obj.currentUserInfo.email === undefined) {
      // 实例化邮箱对象
      obj.currentUserInfo.email = new Email();
    }
  });
});

watch(reloadDataStatus, (nV, oV) => {
  // 重新加载数据
  if (nV) {
    emitter.emit('reloadUserData');
  }
});

const handleBindEmail = (value: boolean) => {
  // 如果是添加用户，不支持直接绑定邮箱
  if (!obj.updateUserInfo) {
    message.error('添加用户不支持绑定邮箱');
    obj.currentUserInfo.verifyEmail = !value;
    return;
  }
  if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(obj.currentUserInfo.email?.email)) {
    message.error('请输入正确邮箱');
    obj.currentUserInfo.verifyEmail = !value;
    return;
  }

  obj.currentUserInfo.verifyEmail = !value;
  obj.bindEmailLoadingStatus = true;

  // 发送请求绑定邮箱
  bindEmailForUser(obj.currentUserInfo.email?.email)
    .then(data => {
      if (data.success) {
        // 发送验证邮箱成功，并没有绑定成功
        obj.bindEmailLoadingStatus = false;
        obj.currentUserInfo.verifyEmail = value;
        message.success('请至邮箱中点击链接绑定');

        if (auth.getUserInfo.uid === obj.currentUserInfo.uid) {
          auth.updateUserinfo();
        }
      }
    })
    .catch(e => {
      obj.bindEmailLoadingStatus = false;
      obj.currentUserInfo.verifyEmail = false;
    });
};
</script>

<style scoped lang="less">
.user-avatar {
  margin: 0 auto;
  text-align: center;
}
</style>
