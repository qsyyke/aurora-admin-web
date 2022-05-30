<template>
  <n-grid cols="2" item-responsive>
    <n-grid-item span="l:3">
      <n-space vertical :size="28">
        <n-card title="修改密码" :bordered="false">
          <n-space vertical :size="28">
            <n-space vertical :size="14">
              <n-text> 旧密码 </n-text>
              <n-input v-model:value="obj.originPwd" :minlength="4" :maxlength="15" round placeholder="旧密码" />
            </n-space>

            <n-space vertical :size="14">
              <n-text> 新密码 </n-text>
              <n-input v-model:value="obj.newPwd" :minlength="4" :maxlength="15" round placeholder="新密码" />
            </n-space>

            <n-space vertical :size="14">
              <n-text> 重复密码 </n-text>
              <n-input v-model:value="obj.repeatPwd" :minlength="4" :maxlength="15" round placeholder="重复密码" />
            </n-space>

            <n-row :gutter="[0, 24]">
              <n-col :span="24">
                <div style="display: flex; justify-content: right">
                  <n-button round type="primary" @click="updatePassword"> 修改 </n-button>
                </div>
              </n-col>
            </n-row>
          </n-space>
        </n-card>

        <n-card title="绑定邮箱" :bordered="false">
          <n-space vertical :size="28">
            <n-space vertical :size="14">
              <n-text> 邮箱号 </n-text>
              <n-input
                v-model:value="obj.userEmail"
                :minlength="4"
                :maxlength="254"
                round
                :placeholder="obj.addEmail ? '请输入邮箱' : '请输入新邮箱'"
              />
            </n-space>

            <n-grid cols="2" item-responsive>
              <n-grid-item span="l:3">
                <n-text> 切换&nbsp;&nbsp; </n-text> <n-switch v-model:value="obj.addEmail" />
              </n-grid-item>
              <n-grid-item span="l:3">
                <n-row :gutter="[0, 24]">
                  <n-col :span="24">
                    <div style="display: flex; justify-content: right">
                      <n-button round type="primary" @click="bindUserEmail">
                        {{ obj.addEmail ? '添加' : '换绑' }}
                      </n-button>
                    </div>
                  </n-col>
                </n-row>
              </n-grid-item>
            </n-grid>
          </n-space>
        </n-card>
      </n-space>
    </n-grid-item>
    <n-grid-item span="l:3"> </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useMessage, useLoadingBar } from 'naive-ui';
import { REGEXP_EMAIL } from '@/config';
import { useAuthStore } from '@/store';
import { bindEmailForUser, updateUserPassword } from '@/service';
import { insertEmail } from '@/service/api/message/email';
import { Email } from '@/theme/message';

const auth = useAuthStore();
const message = useMessage();
const loadBar = useLoadingBar();
const obj = reactive({
  originPwd: '',
  newPwd: '',
  repeatPwd: '',
  authUserInfo: auth.getUserInfo,
  addEmail: false,
  userEmail: ''
});

const updatePassword = () => {
  if (obj.newPwd !== obj.repeatPwd) {
    message.error('两次密码不同');
    obj.repeatPwd = '';
    obj.newPwd = '';
    return;
  }

  if (obj.newPwd === '' || obj.newPwd === null || obj.newPwd === undefined) {
    message.error('密码不能为空');
    return;
  }

  // 修改密码
  updateUserPassword(obj.authUserInfo.username as string, obj.originPwd, obj.newPwd).then(data => {
    if (data.success) {
      message.success('修改密码成功');
      // 更新用户的信息
      auth.updateUserinfo();
    }
  });
};

const bindUserEmail = () => {
  if (!REGEXP_EMAIL.test(obj.userEmail)) {
    message.error('请输入正确的邮箱号');
    obj.userEmail = '';
    return;
  }

  loadBar.start();
  if (obj.addEmail) {
    // 添加新的邮箱
    const email = new Email();
    email.email = obj.userEmail;
    email.userUid = obj.authUserInfo.userUid;
    insertEmail(email).then(data => {
      if (data.success) {
        // 添加成功 绑定
        bindEmailForUser(obj.userEmail).then(res => {
          if (res.success) {
            message.success('已发送验证链接到该邮箱，请至邮箱中检查');
            loadBar.finish();
          } else {
            loadBar.error();
          }
        });
      } else {
        loadBar.error();
      }
    });
  } else {
    // 换绑
    bindEmailForUser(obj.userEmail).then(data => {
      if (data.success) {
        loadBar.finish();
        message.success('已发送验证链接到该邮箱，请至邮箱中检查');
      } else {
        loadBar.error();
      }
    });
  }
};
</script>

<style scoped>
.light-green {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: rgba(0, 128, 0, 0.24);
}
</style>
