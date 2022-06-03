<template>
  <div>
    <n-drawer v-model:show="obj.showDrawer" :width="502" placement="right">
      <n-drawer-content :title="`来自 ${obj.currentCommentInfo.username} 的评论信息`">
        <n-space vertical :size="20">
          <n-descriptions label-placement="left" size="large" :column="1">
            <n-descriptions-item label="用户名">
              <template #default>
                <n-tag checkable @click="copyContent(obj.currentCommentInfo.username)">{{
                  obj.currentCommentInfo.username
                }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="邮箱">
              <template #default>
                <n-tag checkable @click="copyContent(obj.currentCommentInfo.email)">{{
                  obj.currentCommentInfo.email
                }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="是否邮件通知">
              <template #default>
                <n-tag :type="obj.currentCommentInfo.emailNotice ? 'success' : 'error'">
                  {{ obj.currentCommentInfo.emailNotice ? '已通知' : '未通知' }}
                </n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="操作系统信息">
              <template #default>
                <n-tag checkable>{{ obj.currentCommentInfo.operationSystemInfo }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="评论地址">
              <template #default>
                <a :href="obj.currentCommentInfo.path" target="_blank">点击访问</a>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="评论页面类型">
              <template #default>
                <n-tag type="success">{{ obj.currentCommentInfo.pageType }}</n-tag>
              </template>
            </n-descriptions-item>
            <n-descriptions-item label="用户站点">
              <a :href="obj.currentCommentInfo.site" target="_blank">点击访问</a>
            </n-descriptions-item>
            <n-descriptions-item label="所属用户"> aurora </n-descriptions-item>
            <n-descriptions-item label="上传时间"> {{ obj.currentCommentInfo.createTime }} </n-descriptions-item>
            <n-descriptions-item label="最后更新时间"> {{ obj.currentCommentInfo.updateTime }} </n-descriptions-item>
            <n-descriptions-item label="评论类型">
              <n-tag type="success">{{ obj.currentCommentInfo.replyCommentUid ? '回复评论' : '单独评论' }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item v-if="obj.currentCommentInfo.replyCommentUid" label="父评论">
              <n-tag checkable @click="showCommentInfoByUid(obj.currentCommentInfo.replyCommentUid)">
                {{ obj.currentCommentInfo.replyCommentUid }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item v-if="obj.currentCommentInfo.nextCommentUidArray" label="子评论信息">
              <n-space :size="10"
                ><n-tag
                  v-for="(item, index) in obj.currentCommentInfo.nextCommentUidArray.split(',')"
                  :key="index"
                  checkable
                  @click="showCommentInfoByUid(item)"
                  >{{ item }}</n-tag
                ></n-space
              >
            </n-descriptions-item>
          </n-descriptions>

          <n-input
            v-model:value="obj.currentCommentInfo.content"
            type="textarea"
            placeholder="评论内容"
            round
            clearable
          />

          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: left">
                <n-space>
                  <n-button round type="primary" @click="handleUpdateCommentInfo"> 修改 </n-button>
                  <n-button
                    round
                    :disabled="obj.currentCommentInfo.emailNotice"
                    type="primary"
                    @click="resendCommentEmail"
                  >
                    邮箱通知
                  </n-button>
                  <n-button round type="error" @click="handleDeleteCommentInfo(obj.currentCommentInfo)">
                    删除
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
        <n-tab-pane name="unRead" tab="未读">
          <n-data-table :columns="columns" :data="obj.commentArr" />
        </n-tab-pane>
        <n-tab-pane name="hadRead" tab="已读"> 未实现 </n-tab-pane>
        <n-tab-pane name="RubbishComment" tab="垃圾评论"> 未实现 </n-tab-pane>
      </n-tabs>

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
  NSwitch,
  NTag,
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadInst
} from 'naive-ui';
import { useClipboard } from '@vueuse/core';
import { ArchiveOutline, TextOutline } from '@vicons/ionicons5';
import { useAuthStore } from '@/store';
import {
  deleteComment,
  deleteEmailLogByUid,
  deleteFile,
  deleteFileInfo,
  fetchAllCommentByCondition,
  fetchSpecifyFormatFiles,
  fetchUserByUserUid,
  resendCommentEmailNotice,
  updateComment,
  updateFileInfo,
  updateUser,
  uploadSingleFile
} from '@/service';
import { AuroraFile } from '@/theme/file';
import { Condition } from '@/theme';
import emitter from '@/utils/mitt';
import { EmailLog } from '@/theme/message/emailLog';
import { Comment, CommentDTO } from '@/theme/comment';
import { resendRabbitMqMessage } from '@/service/api/message/messageLog';

const { copy, isSupported } = useClipboard();

const auth = useAuthStore();
const obj = reactive({
  /** 图片文件的后缀名 */
  commentArr: new Set<Comment>(),
  condition: new Condition(false, true, true),
  showDrawer: false,
  currentCommentInfo: new Comment(),
  pageTotal: 0
});

const loadAllComment = () => {
  obj.commentArr = new Set<Comment>();
  fetchAllCommentByCondition(obj.condition).then(data => {
    obj.pageTotal = data.data.total;
    data.data.result.forEach(comment => {
      obj.commentArr.add(comment);
    });
  });
};

onBeforeMount(() => {
  // 发送请求，获取图片数据
  loadAllComment();
});

const showCommentDetails = (commentInfo: Comment) => {
  obj.currentCommentInfo = commentInfo;
  obj.showDrawer = true;
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

/**
 * 重新发送评论的邮件通知
 */
const resendCommentEmail = () => {
  window.$loadingBar?.start();
  resendCommentEmailNotice(obj.currentCommentInfo.uid as string)
    .then(data => {
      if (data.success) {
        window.$loadingBar?.finish();
        window.$message?.success('成功发送');
        loadAllComment();
        obj.showDrawer = false;
      } else {
        window.$loadingBar?.error();
      }
    })
    .catch(e => {
      window.$loadingBar?.error();
    });
};

// 删除文件
const handleDeleteCommentInfo = (commentInfo: Comment) => {
  deleteComment(commentInfo.uid as string).then(data => {
    if (data.success) {
      window.$message?.success(`已删除 ${commentInfo.username} 在 ${commentInfo.createTime} 发布的评论`);
      loadAllComment();
    }
  });
};

const handleUpdateCommentInfo = () => {
  if (!obj.currentCommentInfo) {
    return;
  }
  updateComment(obj.currentCommentInfo).then(data => {
    if (data.success) {
      window.$message?.success(`修改 ${obj.currentCommentInfo.username} 的评论成功`);
      loadAllComment();
      obj.showDrawer = false;
    }
  });
};

const changePageSize = (pageSize: number) => {
  obj.condition.pageSize = pageSize;
  loadAllComment();
};
const changeCurrentPage = (page: number) => {
  obj.condition.pageNum = page;
  // 重新加载数据
  loadAllComment();
};

const showCommentInfoByUid = (commentUid: string) => {
  const condition = new Condition(null, null, null);
  condition.uid = commentUid;
  fetchAllCommentByCondition(condition).then(data => {
    if (data.success) {
      if (data.data.result && data.data.result.length !== 0) {
        obj.currentCommentInfo = data.data.result[0];
      } else {
        window.$message?.error(`未查询到该 ${commentUid} 的信息`);
      }
    }
  });
};

onMounted(() => {
  emitter.on('globalSearchCondition', e => {
    const originCondition = obj.condition;
    obj.condition = e as Condition;
    obj.condition.pageSize = originCondition.pageSize;
    obj.condition.pageNum = originCondition.pageNum;
    loadAllComment();
  });
});

const updateCommentShowStatus = (commentInfo: Comment) => {
  updateComment(commentInfo).then(data => {
    if (data.success) {
      window.$message?.success(`修改该评论的展示状态为 ${commentInfo.showComment ? '展示' : '不展示'}`);
      loadAllComment();
    }
  });
};

const createColumns = (): DataTableColumns<Comment> => {
  return [
    {
      type: 'selection'
    },
    {
      title: '头像',
      key: 'avatar',
      width: 80,
      render(row) {
        return h(NAvatar, {
          src: row.avatar as string,
          fallbackSrc: 'https://picture.xcye.xyz/avatar.jpg',
          round: true
        });
      }
    },
    {
      title: '用户名',
      key: 'username',
      width: 150,
      render(row) {
        return h(
          NEllipsis,
          {
            lineClamp: 1
          },
          { default: () => row.username }
        );
      }
    },
    {
      title: '评论内容',
      key: 'content',
      width: 350,
      render(row) {
        return h(
          NEllipsis,
          {
            lineClamp: 1,
            tooltip: false
          },
          {
            default: () => row.content
          }
        );
      }
    },
    {
      title: '评论IP',
      key: 'commentIp',
      width: 150,
      render(row) {
        return h(
          NTag,
          {
            checkable: true,
            onClick: () => copyContent(row.commentIp as string)
          },
          {
            default: () => row.commentIp
          }
        );
      }
    },
    {
      title: '展示状态',
      key: 'showComment',
      width: 170,
      render(row) {
        return h(NSwitch, {
          defaultValue: row.showComment,
          onUpdateValue: (value: boolean) => {
            row.showComment = value;
            updateCommentShowStatus(row);
          }
        });
      }
    },
    {
      title: '发布时间',
      key: 'createTime',
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
                onClick: () => handleDeleteCommentInfo(row)
              },
              { default: () => '删除评论' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                ghost: true,
                onClick: () => showCommentDetails(row)
              },
              { default: () => '查看详情' }
            )
          )
        );
      }
    }
  ];
};

const columns = createColumns();
</script>
