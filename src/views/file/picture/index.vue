<template>
  <div>
    <n-drawer v-model:show="obj.showDrawer" :width="502" placement="bottom">
      <n-drawer-content>
        <n-space vertical :size="30">
          <n-descriptions label-placement="left" title="文件详情" size="large" :column="2">
            <n-descriptions-item label="文件名">
              <template #default>
                <n-tag checkable @click="copyContent(obj.currentFileInfo.file.fileName)">{{
                  obj.currentFileInfo.file.fileName
                }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="拥有者">
              <template #default>
                <n-tag checkable @click="copyContent(obj.currentFileInfo.owner)">{{ obj.currentFileInfo.owner }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="访问路径">
              <template #default>
                <n-tag checkable @click="copyContent(obj.currentFileInfo.file.path)">{{
                  obj.currentFileInfo.file.path
                }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="存储路径">
              <template #default>
                <n-tag checkable @click="copyContent(obj.currentFileInfo.file.storagePath)">{{
                  obj.currentFileInfo.file.storagePath
                }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="存储模式">
              <template #default>
                <n-tag type="success">{{ obj.storageModeOption[obj.currentFileInfo.file.storageMode] }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="大小">
              {{ (obj.currentFileInfo.file.size / 1024 / 1024).toFixed(2) }} M</n-descriptions-item
            >
            <n-descriptions-item label="下载">
              <template #default>
                <n-tag checkable @click="downloadFile"> 点击下载 </n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="上传时间"> {{ obj.currentFileInfo.file.createTime }} </n-descriptions-item>
            <n-descriptions-item label="是否删除">
              <template #default>
                <n-tag :type="obj.currentFileInfo.file.delete ? 'error' : 'success'">{{
                  obj.currentFileInfo.file.delete ? '已删除' : '未删除'
                }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="删除时间"> {{ obj.currentFileInfo.file.deleteTime }} </n-descriptions-item>
          </n-descriptions>

          <n-input
            v-model:value="obj.currentFileInfo.file.summary"
            type="textarea"
            placeholder="文件描述"
            round
            clearable
          />
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: right">
                <n-space>
                  <n-button round type="error" @click="handleDeleteFileInfo(obj.currentFileInfo.file)"> 删除 </n-button>
                  <n-button round type="primary" @click="handleUpdateFileInfo"> 修改 </n-button>
                </n-space>
              </div>
            </n-col>
          </n-row>
        </n-space>
      </n-drawer-content>
    </n-drawer>

    <n-drawer v-model:show="obj.showUploadFileDrawer" :width="502" placement="right">
      <n-drawer-content>
        <n-space vertical>
          <n-upload
            ref="uploadRef"
            :show-download-button="true"
            multiple
            directory-dnd
            :max="10"
            accept=".jpg, .jpeg, .png"
            :default-upload="false"
            :custom-request="customFileRequest"
            @change="handleUploadFileChange"
            @error="uploadAvatarFailure"
            @finish="uploadFinish"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <archive-outline />
                </n-icon>
              </div>
              <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
              </n-p>
            </n-upload-dragger>
          </n-upload>

          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: left">
                <n-space>
                  <n-button round :disabled="!obj.fileListLength" type="primary" @click="handleUploadFile">
                    上传
                  </n-button>
                  <n-button round :disabled="!obj.isUploadingFile" type="error" @click="interruptUploadFile">
                    中断
                  </n-button>
                </n-space>
              </div>
            </n-col>
          </n-row>
        </n-space>
      </n-drawer-content>
    </n-drawer>
    <n-card size="huge" class="h-full shadow-sm rounded-16px">
      <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="展示">
          <n-grid
            ref="picture-grid"
            :collapsed="false"
            cols="4 s:3 m:4 l:5 xl:4 2xl:7"
            :x-gap="20"
            :y-gap="20"
            :item-responsive="true"
            responsive="self"
          >
            <n-grid-item v-for="(item, index) in obj.pictureArr" ref="picture-grid-item" :key="index">
              <n-card class="h-full shadow-sm rounded-16px" :bordered="false">
                <n-space vertical>
                  <n-image :key="index" :show-toolbar-tooltip="true" :src="item.file.path" />
                  <div class="picture-description">
                    <n-button text @click="showFileDetails(item.file)">
                      <template #icon>
                        <n-icon>
                          <create />
                        </n-icon>
                      </template>
                      详情
                    </n-button>
                  </div>
                </n-space>
              </n-card>
            </n-grid-item>
          </n-grid>
        </n-tab-pane>
        <n-tab-pane name="the beatles" tab="列表">
          <n-data-table :columns="columns" :data="obj.pictureArr" />
        </n-tab-pane>
      </n-tabs>
      <template #header-extra>
        <n-space>
          <n-button strong secondary tertiary round type="success" @click="clickUploadFile"> 上传</n-button>
        </n-space>
      </template>
      <template #header>
        <n-space :size="40">
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: left">
                <n-pagination
                  v-model:page="obj.condition.pageNum"
                  v-model:page-size="obj.condition.pageSize"
                  :item-count="obj.pageTotal"
                  :page-slot="10"
                  show-size-picker
                  :page-sizes="[10, 20, 30]"
                  @update:page-size="changePageSize"
                  @update:page="changeCurrentPage"
                />
              </div>
            </n-col>
          </n-row>

          <n-space>
            <n-tag
              v-for="(item, index) in obj.fileFormatOptions"
              :key="index"
              :checked="obj.searchFileKeyword.has(item)"
              checkable
              @click="clickFileFormat(item)"
            >
              {{ item }}
            </n-tag>
          </n-space>
        </n-space>
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { h, onBeforeMount, onMounted, reactive, ref } from 'vue';
import {
  DataTableColumns,
  NAvatar,
  NButton,
  NEllipsis,
  NSpace,
  NTag,
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadInst
} from 'naive-ui';
import { useClipboard } from '@vueuse/core';
import { ArchiveOutline, Create } from '@vicons/ionicons5';
import { useAuthStore } from '@/store';
import {
  deleteEmailLogByUid,
  deleteFile,
  fetchSpecifyFormatFiles,
  fetchUserByUserUid,
  updateFileInfo,
  updateUser,
  uploadSingleFile
} from '@/service';
import { AuroraFile } from '@/theme/file';
import { Condition } from '@/theme';
import emitter from '@/utils/mitt';
import { EmailLog } from '@/theme/message/emailLog';

const { copy, isSupported } = useClipboard();

class PictureInfo {
  file?: AuroraFile;

  owner?: string;
}

class FileInfo {
  id?: string;

  fileName?: string;

  originFileName?: string;

  localPath?: string;

  status?: 'pending' | 'uploading' | 'error' | 'finished' | 'removed';

  filePath?: string;
}

const auth = useAuthStore();
const obj = reactive({
  /** 图片文件的后缀名 */
  fileFormatOptions: ['png', 'jpg', 'webp', 'gif'],
  pictureArr: new Set<PictureInfo>(),
  condition: new Condition(false, true, true),
  showDrawer: false,
  currentFileInfo: new PictureInfo(),
  storageModeOption: {
    0: '本地存储',
    1: '阿里云OSS',
    2: '又拍云OSS'
  },
  showUploadFileDrawer: false,
  fileListLength: 0,
  isUploadingFile: false,
  fileList: [new FileInfo()],
  pageTotal: 0,
  searchFileKeyword: new Set<string>()
});

const uploadRef = ref<UploadInst | null>(null);

const setConditionKeyword = () => {
  if (obj.searchFileKeyword.size === 0) {
    obj.fileFormatOptions.forEach(value => obj.searchFileKeyword.add(value));
  }

  const searchArr = new Array<string>();
  new Promise((resolve, reject) => {
    obj.searchFileKeyword.forEach(value => searchArr.push(value));
    resolve(searchArr);
  }).then((searchArr: Array) => {
    obj.condition.otherField = searchArr.map(value => `.${value}`).join('|');
  });
};

const loadAllPicture = () => {
  setConditionKeyword();
  obj.pictureArr = new Set<PictureInfo>();
  fetchSpecifyFormatFiles(obj.condition).then(data => {
    obj.pageTotal = data.data.total;
    data.data.result.forEach(value => {
      const pictureInfo = new PictureInfo();
      pictureInfo.file = value;
      obj.pictureArr.add(pictureInfo);
    });
  });
};

onBeforeMount(() => {
  // 发送请求，获取图片数据
  loadAllPicture();
});

const showFileDetails = (fileInfo: AuroraFile) => {
  obj.currentFileInfo.file = fileInfo;
  obj.showDrawer = true;

  // 调用接口，查询该UserUid对应的用户名
  fetchUserByUserUid(fileInfo.userUid as string).then(data => {
    if (data.success) {
      obj.currentFileInfo.owner = data.data.username as string;
    }
  });
};

const copyContent = (content: string) => {
  if (!isSupported) {
    window.$message?.error('您的浏览器不支持Clipboard API');
    return;
  }
  if (!content) {
    window.$message?.error('请输入要复制的内容');
    return;
  }
  copy(content);
  window.$message?.success(`复制成功`);
};

const handleUpdateFileInfo = () => {
  updateFileInfo(obj.currentFileInfo.file as AuroraFile).then(data => {
    if (data.success) {
      window.$message?.success(`修改成功`);
      loadAllPicture();
      obj.showDrawer = false;
    }
  });
};

// 删除文件
const handleDeleteFileInfo = (fileInfo: AuroraFile) => {
  obj.currentFileInfo.file = fileInfo;
  deleteFile(obj.currentFileInfo.file?.uid as string).then(data => {
    if (data.success) {
      window.$message?.success(`删除成功`);
      obj.showDrawer = false;
      loadAllPicture();
    }
  });
};

const handleUploadFileChange = (options: { fileList: UploadFileInfo[] }) => {
  obj.fileListLength = options.fileList.length;
};

const uploadAvatarFailure = options => {
  window.$message?.error('上传文件失败');
};

const customFileRequest = ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress
}: UploadCustomRequestOptions) => {
  obj.isUploadingFile = true;
  uploadSingleFile(file.file, 0, '上传的图片', auth.getAuthUserInfo.userUid)
    .then(result => {
      if (result.success) {
        // 上传成功，修改用户的头像
        window.$message?.success(`文件 ${file.file?.name} 上传成功`);

        // 将上传信息保存
        const fileInfo = new FileInfo();
        fileInfo.fileName = result.data.fileName as string;
        fileInfo.filePath = result.data.path as string;
        fileInfo.id = file.id;
        fileInfo.status = 'finished';
        fileInfo.originFileName = file.file?.name;
        obj.fileList.push(fileInfo);
        onFinish();
      }
    })
    .catch(e => {
      onError();
    });
};

const interruptUploadFile = () => {};

const handleUploadFile = () => {
  uploadRef.value?.submit();
};

const clickUploadFile = () => {
  obj.showUploadFileDrawer = true;
};

const uploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  loadAllPicture();
  // 根据id获取此文件的访问路径
  return obj.fileList
    .filter(value => value.id === file.id)
    .map(value => {
      file.url = value.filePath as string;
      file.name = value.fileName as string;
      return file;
    })[0];
};

const changePageSize = (pageSize: number) => {
  obj.condition.pageSize = pageSize;
  loadAllPicture();
};
const changeCurrentPage = (page: number) => {
  obj.condition.pageNum = page;
  // 重新加载数据
  loadAllPicture();
};

onMounted(() => {
  emitter.on('globalSearchCondition', e => {
    const originCondition = obj.condition;
    obj.condition = e as Condition;
    obj.condition.pageSize = originCondition.pageSize;
    obj.condition.pageNum = originCondition.pageNum;
    loadAllPicture();
  });
});

const clickFileFormat = (fileFormat: string) => {
  // 如果searchFileKeyword存在此fileFormat的话，移除，否则添加
  if (obj.searchFileKeyword.has(fileFormat)) {
    obj.searchFileKeyword.delete(fileFormat);
    loadAllPicture();
  } else {
    obj.searchFileKeyword.add(fileFormat);
    loadAllPicture();
  }
};

const downloadFile = () => {
  const a = document.createElement('a');
  const event = new MouseEvent('click');
  a.download = obj.currentFileInfo.file?.fileName as string;
  a.href = obj.currentFileInfo.file?.path as string;
  a.target = '_blank';
  a.dispatchEvent(event);
};

const createColumns = (): DataTableColumns<PictureInfo> => {
  return [
    {
      type: 'selection'
    },
    {
      title: '图片',
      key: 'file.path',
      width: 300,
      render(row) {
        return h(NAvatar, {
          src: row.file.path as string,
          round: true
        });
      }
    },
    {
      title: '文件名',
      key: 'file.fileName',
      width: 250,
      render(row) {
        return h(
          NTag,
          {
            checkable: true,
            onClick: () => copyContent(row.file.fileName)
          },
          {
            default: () => row.file.fileName
          }
        );
      }
    },
    {
      title: '文件访问路径',
      key: 'file.path',
      width: 300,
      render(row) {
        return h(
          NTag,
          {
            checkable: true,
            onClick: () => copyContent(row.file.path)
          },
          [
            h(
              NEllipsis,
              {
                lineClamp: 1,
                tooltip: false
              },
              {
                default: () => row.file.path
              }
            )
          ]
        );
      }
    },
    {
      title: '文件存储路径',
      key: 'storagePath',
      width: 150,
      render(row) {
        return h(
          NTag,
          {
            checkable: true,
            onClick: () => copyContent(row.file.storagePath)
          },
          [
            h(
              NEllipsis,
              {
                lineClamp: 1,
                tooltip: false
              },
              {
                default: () => '点击拷贝'
              }
            )
          ]
        );
      }
    },
    {
      title: '大小',
      key: 'size',
      width: 200,
      render(row) {
        return `${((row.file.size as number) / 1024 / 1024).toFixed(2)}M`;
      }
    },
    {
      title: '存储模式',
      key: 'storageMode',
      width: 170,
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'success'
          },
          {
            default: () => row.file.storageMode
          }
        );
      }
    },
    {
      title: '创建时间',
      key: 'file.createTime',
      width: 200
    },
    {
      title: '删除时间',
      key: 'file.deleteTime',
      width: 200
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 300,
      render(row) {
        return h(
          NSpace,
          {
            justify: 'center'
          },
          Array.of(
            h(
              NButton,
              {
                size: 'small',
                type: 'warning',
                ghost: true,
                onClick: () => handleDeleteFileInfo(row.file as AuroraFile)
              },
              { default: () => '删除' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                ghost: true,
                onClick: () => showFileDetails(row.file as AuroraFile)
              },
              { default: () => '查看' }
            )
          )
        );
      }
    }
  ];
};

const columns = createColumns();
</script>
