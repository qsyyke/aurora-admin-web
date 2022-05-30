<template>
  <n-layout has-sider :embedded="true">
    <n-layout-sider content-style="padding: 24px;" width="450">
      <n-space vertical>
        <div class="profile-upload">
          <n-upload
            accept=".jpg, .jpeg, .png"
            :show-file-list="false"
            style="margin: 0 auto"
            :headers="{
              'naive-info': 'hello!'
            }"
            @beforeUpload="beforeUploadFile"
            @error="uploadAvatarFailure"
          >
            <n-avatar
              class="profile-avatar"
              round
              :bordered="true"
              :size="220"
              style="cursor: pointer"
              fallback-src="https://picture.xcye.xyz/avatar.jpg"
              :src="obj.currentUserInfo.avatar"
            />
          </n-upload>
        </div>

        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: center">
              <n-space vertical :size="20">
                <n-p> 上次登录时间 </n-p>
                <n-p> 2022-12-23 12:34:34 </n-p>
                <n-p> 上次登录地点 </n-p>
                <n-p> 云南省保山市隆阳区 </n-p>
              </n-space>
            </div>
          </n-col>
        </n-row>
      </n-space>
      <n-p />
      <n-space v-if="obj.authUserInfo.roleArr">
        <n-text> 角色 </n-text>
        <n-divider />
        <n-tag v-for="(item, index) in obj.authUserInfo.roleArr" :key="index" type="success" size="small" round>
          {{ item }}
        </n-tag>
      </n-space>
      <n-p />
      <n-space>
        <n-radio :checked="obj.currentUserInfo.gender === 'MALE'" value="MALE" name="basic-demo" @change="changeGender">
          男
        </n-radio>
        <n-radio
          :checked="obj.currentUserInfo.gender === 'FEMALE'"
          value="FEMALE"
          name="basic-demo"
          @change="changeGender"
        >
          女
        </n-radio>
        <n-radio
          value="SECRET"
          :checked="obj.currentUserInfo.gender === 'SECRET' || obj.currentUserInfo.gender === null"
          name="basic-demo"
          @change="changeGender"
        >
          秘密
        </n-radio>
      </n-space>
    </n-layout-sider>
    <n-layout-content
      content-style="padding: 24px;background: rgba(255, 255, 255, 0);"
      style="background: rgba(255, 255, 255, 0)"
    >
      <n-space vertical :size="28">
        <n-space vertical :size="14">
          <n-text> 用户名 </n-text>
          <n-input
            v-model:value="obj.currentUserInfo.username"
            :minlength="4"
            :maxlength="15"
            round
            placeholder="username"
          />
        </n-space>

        <n-space vertical :size="14">
          <n-text> 昵称 </n-text>
          <n-input
            v-model:value="authUser.userInfo.nickname"
            :minlength="4"
            :maxlength="15"
            round
            placeholder="nickname"
          />
        </n-space>

        <n-space vertical :size="14">
          <n-text> 邮箱 </n-text>
          <n-input
            :value="authUser.userInfo.email.email === undefined ? '未绑定' : authUser.userInfo.email.email"
            :minlength="4"
            disabled
            :maxlength="254"
            round
            placeholder="email"
          />
        </n-space>

        <n-space vertical :size="14">
          <n-text> 专业 </n-text>
          <n-input v-model:value="obj.currentUserInfo.profession" round placeholder="profession" />
        </n-space>

        <n-space vertical :size="14">
          <n-text> 描述 </n-text>
          <n-input v-model:value="obj.currentUserInfo.userSummary" round placeholder="summary" />
        </n-space>

        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: left">
              <n-button round type="primary" @click="handleSaveUserInfo"> 保存 </n-button>
            </div>
          </n-col>
        </n-row>
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue';
import { NP, useMessage } from 'naive-ui';
import { useAuthStore } from '@/store';
import { updateUser, uploadSingleFile } from '@/service';
import { User } from '@/theme';

export default defineComponent({
  setup() {
    const message = useMessage();
    const userAuthStore = useAuthStore();
    const obj = reactive({
      currentUserInfo: new User(),
      authUserInfo: userAuthStore.getAuthUserInfo
    });

    const handleSaveUserInfo = () => {
      // 保存用户信息
      if (obj.currentUserInfo.username === '') {
        obj.currentUserInfo.username = null;
      }
      if (obj.currentUserInfo.nickname === '') {
        obj.currentUserInfo.nickname = null;
      }
      updateUser(obj.currentUserInfo).then(data => {
        if (data.success) {
          message.success('修改信息成功');

          // 重新存储用户信息
          userAuthStore.updateUserinfo();
        }
      });
    };

    const loadUserInfo = () => {
      obj.currentUserInfo = userAuthStore.getUserInfo;
    };

    return {
      obj,
      NP,
      loadUserInfo,
      authUser: useAuthStore(),
      handleSaveUserInfo,
      uploadAvatarFailure(options) {
        message.error('上传头像失败');
      },
      changeGender(e: Event) {
        obj.currentUserInfo.gender = (e.target as HTMLInputElement).value;
      },
      beforeUploadFile(option) {
        uploadSingleFile({
          file: option.file.file,
          storageMode: 0,
          summary: `${obj.currentUserInfo.username} 的头像上传`,
          userUid: obj.currentUserInfo.uid
        }).then(data => {
          if (data.success) {
            // 上传成功，修改用户的头像
            obj.currentUserInfo.avatar = data.data.path;
            updateUser(obj.currentUserInfo).then(result => {
              if (result.success) {
                message.success('修改头像成功');
              }
            });
          }
        });
      }
    };
  },
  created() {
    this.loadUserInfo();
  }
});
</script>

<style scoped lang="less">
.profile-upload .n-upload {
  display: flex;
  justify-content: center;
  align-items: center;

  .profile-avatar {
    margin: 0 auto;
  }
}
</style>
