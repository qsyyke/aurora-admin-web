<template>
  <n-upload
    action="http://localhost:7777/file/single"
    :headers="{
      'naive-info': 'hello!'
    }"
    :data="{
      'naive-data': 'cool! naive!',
      storageMode: 0,
      userUid: '1522074993315815424'
    }"
    method="POST"
    :custom-request="customRequest"
  >
    <n-button>上传文件</n-button>
  </n-upload>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMessage, UploadCustomRequestOptions } from 'naive-ui';
import { lyla } from 'lyla';

export default defineComponent({
  setup() {
    const message = useMessage();
    const customRequest = ({
      file,
      data,
      headers,
      withCredentials,
      action,
      onFinish,
      onError,
      onProgress
    }: UploadCustomRequestOptions) => {
      console.log(file);
      console.log(data);
      console.log(headers);
      console.log(withCredentials);
      console.log(action);
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach(key => {
          formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
        });
      }
      formData.append('file', file.file as File);
      lyla
        .post(action as string, {
          withCredentials,
          headers: headers as Record<string, string>,
          body: formData
        })
        .then(({ json }) => {
          console.log(`json ${json}`);
          message.success(json);
          onFinish();
        })
        .catch(error => {
          console.log(`异常 ${error}`);
          message.success(error.message);
          onError();
        });
    };
    return {
      customRequest
    };
  }
});
</script>
