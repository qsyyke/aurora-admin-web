<template>
  <n-space vertical>
    <n-layout has-sider sider-placement="right">
      <n-layout-content content-style="padding: 24px;">
        <n-space vertical :size="50">
          <div>
            <n-descriptions label-placement="top" title="标题" :column="1" size="large">
              <n-descriptions-item>
                <template #default>
                  <n-input
                    v-if="obj.isEditArticleTitle"
                    v-model:value="obj.currentArticle.title"
                    type="text"
                    placeholder="请输入标题"
                    :bordered="false"
                    @blur="titleBlurEvent"
                  />
                  <n-text v-else type="primary" :underline="true" style="font-size: 1.5rem" @click="editTitle">{{
                    obj.currentArticle.title ? obj.currentArticle.title : '暂时没有标题'
                  }}</n-text>
                </template>
              </n-descriptions-item>
            </n-descriptions>
          </div>

          <div>
            <n-space vertical :size="0">
              <n-h5> 内容 </n-h5>
              <div ref="articleMarkdown"></div>
            </n-space>
          </div>
        </n-space>
      </n-layout-content>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="0"
        width="calc(22vw)"
        :native-scrollbar="true"
        show-trigger="arrow-circle"
        content-style="padding: 24px;"
        bordered
      >
        <n-space vertical :size="20">
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: left">
                <n-space>
                  <n-button round type="primary" @click="handlePublishArticle"> 发布 </n-button>
                  <n-button round type="primary" @click="handleSaveArticle"> 保存 </n-button>
                </n-space>
              </div>
            </n-col>
          </n-row>
          <n-descriptions label-placement="left" label-align="left" :column="2" size="large" separator="  ">
            <n-descriptions-item label-style="font-size: 1.3rem;">
              <template #label>原创</template>
              <template #default>
                <n-switch v-model:value="obj.currentArticle.originalArticle" :unchecked-value="false" size="medium" />
              </template>
            </n-descriptions-item>
          </n-descriptions>
          <n-input
            v-if="!obj.currentArticle.originalArticle && obj.isEditOriginArticleUrl"
            v-model:value="obj.currentArticle.originalArticleUrl"
            type="text"
            :clearable="true"
            placeholder="请输入原创链接"
            :bordered="false"
            @blur="originalArticleBlurEvent"
          />
          <n-text
            v-if="!obj.isEditOriginArticleUrl && !obj.currentArticle.originalArticle"
            type="primary"
            :underline="true"
            style="font-size: 1rem"
            @click="editOriginalArticleUrl"
            >{{
              obj.currentArticle.originalArticleUrl ? obj.currentArticle.originalArticleUrl : '请输入原创地址'
            }}</n-text
          >

          <n-descriptions label-placement="left" label-align="left" :column="2" size="large" separator="  ">
            <n-descriptions-item label-style="font-size: 1.3rem;">
              <template #label>允许评论</template>
              <template #default>
                <n-switch v-model:value="obj.currentArticle.showComment" :unchecked-value="false" size="medium" />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="left" label-align="left" :column="2" size="large" separator="  ">
            <n-descriptions-item label-style="font-size: 1.3rem;">
              <template #label>定时发布</template>
              <template #default>
                <n-switch :unchecked-value="false" size="medium" />
              </template>
            </n-descriptions-item>
          </n-descriptions>
          <n-date-picker v-model:value="timingPublishTime" type="datetime" clearable @update:show="handleDate" />
          <n-descriptions label-placement="top" title="标签" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-dynamic-tags v-model:value="obj.tagArr" :render-tag="renderTag" />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="top" title="类别" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-dynamic-tags v-model:value="obj.categoryArr" :render-tag="renderCategory" />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="top" title="概述" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-input
                  v-model:value="obj.currentArticle.summary"
                  type="textarea"
                  placeholder="文章概述"
                  round
                  clearable
                />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="top" title="封面" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-space vertical>
                  <n-input
                    v-model:value="obj.currentArticle.coverPictureUrl"
                    type="text"
                    placeholder="文章封面图地址"
                  />
                  <n-image
                    :fallback-src="`https://pic-tool.xcye.xyz/pic/rmimg?time=${new Date().getTime()}`"
                    :src="obj.currentArticle.coverPictureUrl"
                  />
                </n-space>
              </template>
            </n-descriptions-item>
          </n-descriptions>
        </n-space>
      </n-layout-sider>
    </n-layout>
  </n-space>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, reactive, computed, h } from 'vue';
import { NTag } from 'naive-ui';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { rand } from '@vueuse/core';
import { uploadFiles } from 'vditor/dist/ts/upload';
import axios from 'axios';
import { useAuthStore, useThemeStore } from '@/store';
import { insertArticle, uploadMultiFile, uploadSingleFile } from '@/service';
import { formatTime } from '@/utils';
import { Article } from '@/theme/article/article';

const auth = useAuthStore();

const theme = useThemeStore();

const obj = reactive({
  tagTypeOption: ['default', 'primary', 'info', 'success', 'warning', 'error'],
  isEditArticle: true,
  isEditArticleTitle: false,
  isEditOriginArticleUrl: false,
  isEditCoverUrl: false,
  currentArticle: new Article(),
  tagArr: new Array<string>(),
  categoryArr: new Array<string>()
});

const isImage = (fileName: string): boolean => {
  return /\.(png|jpg|jpeg|gif|webp)$/.test(fileName);
};

const vditor = ref<Vditor>();
const articleMarkdown = ref<HTMLElement>();

function renderVditor() {
  if (!articleMarkdown.value) return;
  vditor.value = new Vditor(articleMarkdown.value, {
    minHeight: 800,
    theme: theme.darkMode ? 'dark' : 'classic',
    icon: 'material',
    cache: { enable: false },
    input(value: string) {
      obj.currentArticle.content = value;
    },
    focus(value: string) {},
    esc(value: string) {},
    select(value: string) {},
    debugger: false,
    value: obj.currentArticle.content as string,
    // toolbar: [
    //   // {
    //   //   hotkey: '⇧⌘S',
    //   //   name: 'sponsor',
    //   //   tipPosition: 's',
    //   //   tip: '成为赞助者',
    //   //   className: 'asdfasdf',
    //   //   icon: '<svg t="1589994565028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2808" width="32" height="32"><path d="M506.6 423.6m-29.8 0a29.8 29.8 0 1 0 59.6 0 29.8 29.8 0 1 0-59.6 0Z" fill="#0F0F0F" p-id="2809"></path><path d="M717.8 114.5c-83.5 0-158.4 65.4-211.2 122-52.7-56.6-127.7-122-211.2-122-159.5 0-273.9 129.3-273.9 288.9C21.5 562.9 429.3 913 506.6 913s485.1-350.1 485.1-509.7c0.1-159.5-114.4-288.8-273.9-288.8z" fill="#FAFCFB" p-id="2810"></path><path d="M506.6 926c-22 0-61-20.1-116-59.6-51.5-37-109.9-86.4-164.6-139-65.4-63-217.5-220.6-217.5-324 0-81.4 28.6-157.1 80.6-213.1 53.2-57.2 126.4-88.8 206.3-88.8 40 0 81.8 14.1 124.2 41.9 28.1 18.4 56.6 42.8 86.9 74.2 30.3-31.5 58.9-55.8 86.9-74.2 42.5-27.8 84.3-41.9 124.2-41.9 79.9 0 153.2 31.5 206.3 88.8 52 56 80.6 131.7 80.6 213.1 0 103.4-152.1 261-217.5 324-54.6 52.6-113.1 102-164.6 139-54.8 39.5-93.8 59.6-115.8 59.6zM295.4 127.5c-72.6 0-139.1 28.6-187.3 80.4-47.5 51.2-73.7 120.6-73.7 195.4 0 64.8 78.3 178.9 209.6 305.3 53.8 51.8 111.2 100.3 161.7 136.6 56.1 40.4 88.9 54.8 100.9 54.8s44.7-14.4 100.9-54.8c50.5-36.3 108-84.9 161.7-136.6 131.2-126.4 209.6-240.5 209.6-305.3 0-74.9-26.2-144.2-73.7-195.4-48.2-51.9-114.7-80.4-187.3-80.4-61.8 0-127.8 38.5-201.7 117.9-2.5 2.6-5.9 4.1-9.5 4.1s-7.1-1.5-9.5-4.1C423.2 166 357.2 127.5 295.4 127.5z" fill="#141414" p-id="2811"></path><path d="M353.9 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2812"></path><path d="M659.3 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2813"></path><path d="M411.6 538.5c0 52.3 42.8 95 95 95 52.3 0 95-42.8 95-95v-31.7h-190v31.7z" fill="#5B5143" p-id="2814"></path><path d="M506.6 646.5c-59.6 0-108-48.5-108-108v-31.7c0-7.2 5.8-13 13-13h190.1c7.2 0 13 5.8 13 13v31.7c0 59.5-48.5 108-108.1 108z m-82-126.7v18.7c0 45.2 36.8 82 82 82s82-36.8 82-82v-18.7h-164z" fill="#141414" p-id="2815"></path><path d="M450.4 578.9a54.7 27.5 0 1 0 109.4 0 54.7 27.5 0 1 0-109.4 0Z" fill="#EA64F9" p-id="2816"></path><path d="M256 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2817"></path><path d="M703.3 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2818"></path></svg>',
    //   //   click() {
    //   //     alert('捐赠地址：https://ld246.com/sponsor');
    //   //   },
    //   //   toolbar: [
    //   //     {
    //   //       hotkey: '⇧⌘S',
    //   //       name: 'sponsor',
    //   //       tipPosition: 's',
    //   //       tip: 'asdf',
    //   //       className: 'right',
    //   //       icon: '<svg t="1589994565028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2808" width="32" height="32"><path d="M506.6 423.6m-29.8 0a29.8 29.8 0 1 0 59.6 0 29.8 29.8 0 1 0-59.6 0Z" fill="#0F0F0F" p-id="2809"></path><path d="M717.8 114.5c-83.5 0-158.4 65.4-211.2 122-52.7-56.6-127.7-122-211.2-122-159.5 0-273.9 129.3-273.9 288.9C21.5 562.9 429.3 913 506.6 913s485.1-350.1 485.1-509.7c0.1-159.5-114.4-288.8-273.9-288.8z" fill="#FAFCFB" p-id="2810"></path><path d="M506.6 926c-22 0-61-20.1-116-59.6-51.5-37-109.9-86.4-164.6-139-65.4-63-217.5-220.6-217.5-324 0-81.4 28.6-157.1 80.6-213.1 53.2-57.2 126.4-88.8 206.3-88.8 40 0 81.8 14.1 124.2 41.9 28.1 18.4 56.6 42.8 86.9 74.2 30.3-31.5 58.9-55.8 86.9-74.2 42.5-27.8 84.3-41.9 124.2-41.9 79.9 0 153.2 31.5 206.3 88.8 52 56 80.6 131.7 80.6 213.1 0 103.4-152.1 261-217.5 324-54.6 52.6-113.1 102-164.6 139-54.8 39.5-93.8 59.6-115.8 59.6zM295.4 127.5c-72.6 0-139.1 28.6-187.3 80.4-47.5 51.2-73.7 120.6-73.7 195.4 0 64.8 78.3 178.9 209.6 305.3 53.8 51.8 111.2 100.3 161.7 136.6 56.1 40.4 88.9 54.8 100.9 54.8s44.7-14.4 100.9-54.8c50.5-36.3 108-84.9 161.7-136.6 131.2-126.4 209.6-240.5 209.6-305.3 0-74.9-26.2-144.2-73.7-195.4-48.2-51.9-114.7-80.4-187.3-80.4-61.8 0-127.8 38.5-201.7 117.9-2.5 2.6-5.9 4.1-9.5 4.1s-7.1-1.5-9.5-4.1C423.2 166 357.2 127.5 295.4 127.5z" fill="#141414" p-id="2811"></path><path d="M353.9 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2812"></path><path d="M659.3 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2813"></path><path d="M411.6 538.5c0 52.3 42.8 95 95 95 52.3 0 95-42.8 95-95v-31.7h-190v31.7z" fill="#5B5143" p-id="2814"></path><path d="M506.6 646.5c-59.6 0-108-48.5-108-108v-31.7c0-7.2 5.8-13 13-13h190.1c7.2 0 13 5.8 13 13v31.7c0 59.5-48.5 108-108.1 108z m-82-126.7v18.7c0 45.2 36.8 82 82 82s82-36.8 82-82v-18.7h-164z" fill="#141414" p-id="2815"></path><path d="M450.4 578.9a54.7 27.5 0 1 0 109.4 0 54.7 27.5 0 1 0-109.4 0Z" fill="#EA64F9" p-id="2816"></path><path d="M256 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2817"></path><path d="M703.3 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2818"></path></svg>',
    //   //       click() {
    //   //         alert('捐赠地址：https://ld246.com/sponsor');
    //   //       }
    //   //     }
    //   //   ]
    //   // }
    // ],
    counter: {
      enable: true
    },
    outline: {
      enable: true,
      position: 'left'
    },
    upload: {
      headers: {
        Authorization: auth.token
      },
      handler(files: File[]): string | Promise<string> | Promise<null> | null {
        vditor.value?.disabled();
        files.forEach(file => {
          vditor.value?.tip(`正在上传`, 2000);
        });
        uploadMultiFile(
          files,
          0,
          `从${auth.getAuthUserInfo.username}的博客文章中上传的文件`,
          '1522074993315815424'
        ).then(data => {
          // 上传成功，手动设置文本的内容
          let fileContent = '';
          if (data.success) {
            data.data.forEach((file, index) => {
              if (isImage(file.fileName as string)) {
                // 图片
                fileContent += `\n ![${file.fileName}](${file.path})`;
              } else {
                // 不是图片
                fileContent += `[${file.fileName}](${file.path})`;
              }
              if (index === data.data.length - 1) {
                vditor.value?.setValue(vditor.value?.getValue() + fileContent);
                vditor.value?.enable();
              }
            });
          } else {
            vditor.value?.enable();
          }
        });
        return null;
      }
    }
  });
}

const stopHandle = watch(
  () => theme.darkMode,
  newValue => {
    const themeMode = newValue ? 'dark' : 'classic';
    vditor.value?.setTheme(themeMode);
  }
);

onMounted(() => {
  renderVditor();
});

onUnmounted(() => {
  stopHandle();
});

const getRandomTagType = () => {
  return obj.tagTypeOption[rand(0, obj.tagTypeOption.length)];
};

const editTitle = () => {
  obj.isEditArticleTitle = true;
};

const titleBlurEvent = () => {
  obj.isEditArticleTitle = false;
};

const originalArticleBlurEvent = () => {
  obj.isEditOriginArticleUrl = false;
};

const editOriginalArticleUrl = () => {
  obj.isEditOriginArticleUrl = true;
};

const renderTag = (tag: string, index: number) => {
  return h(
    NTag,
    {
      type: 'primary',
      closable: true,
      onClose: () => {
        obj.tagArr.splice(index, 1);
      }
    },
    {
      default: () => tag
    }
  );
};

const renderCategory = (category: string, index: number) => {
  return h(
    NTag,
    {
      type: 'primary',
      closable: true,
      onClose: () => {
        obj.categoryArr.splice(index, 1);
      }
    },
    {
      default: () => category
    }
  );
};

const handlePublishArticle = () => {
  if (!obj.currentArticle.tagNames) {
    obj.currentArticle.tagNames = '';
  }
  if (!obj.currentArticle.categoryNames) {
    obj.currentArticle.categoryNames = '';
  }
  let tagSet = new Set<string>();
  let categorySet = new Set<string>();
  obj.tagArr.forEach(tag => tagSet.add(tag));
  obj.categoryArr.forEach(category => categorySet.add(category));
  tagSet.forEach(tag => (obj.currentArticle.tagNames = `${obj.currentArticle.tagNames + tag},`));
  categorySet.forEach(
    category => (obj.currentArticle.categoryNames = `${obj.currentArticle.categoryNames + category},`)
  );
  tagSet = new Set<string>();
  categorySet = new Set<string>();
  if (!obj.currentArticle.title) {
    window.$message?.error('请输入标题');
    return;
  }
  if (!obj.currentArticle.content || obj.currentArticle.content === '') {
    window.$message?.error('必须要有内容');
    return;
  }
  if (obj.isEditArticle) {
    // 是新文章
    insertArticle(obj.currentArticle).then(data => {
      if (data.success) {
        window.$message?.success('发布成功');
      }
    });
  }
};

const handleSaveArticle = () => {};

const timingPublishTime = ref();

const handleDate = (showControl: boolean) => {
  if (!showControl) {
    if (timingPublishTime.value !== null) {
      obj.currentArticle.timingPublishTime = formatTime(timingPublishTime.value);
    }
  }
};
</script>
