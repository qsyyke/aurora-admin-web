<template>
  <n-card class="h-full shadow-sm rounded-16px">
    <n-drawer v-model:show="obj.showDrawer" width="calc(45vw)" placement="right">
      <n-drawer-content :title="obj.currentEmailLog.subject">
        <n-card :bordered="false">
          <n-space vertical>
            <div v-html="obj.currentEmailLog.content"></div>
          </n-space>
        </n-card>

        <template #footer>
          <n-space>
            <n-button type="primary" ghost @click="resendMail">重新发送</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
    <n-space vertical>
      <n-data-table :columns="columns" :data="obj.showData" />
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
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
import { h, defineComponent, computed, reactive, onBeforeMount, onMounted } from 'vue';
import { NTag, NButton, useMessage, DataTableColumns, NEllipsis, NSpace, useLoadingBar } from 'naive-ui';
import { deleteEmailLogByUid, fetchAllEmailLog, resendCustomHtmlMailByUid } from '@/service';
import { EmailLog } from '@/theme/message/emailLog';
import { Condition } from '@/theme';
import emitter from '@/utils/mitt';

const message = useMessage();
const loadingBar = useLoadingBar();
const createColumns = ({
  deleteEmailLog,
  showEmailLog
}: {
  deleteEmailLog: (rowData: EmailLog) => void;
  showEmailLog: (rowData: EmailLog) => void;
}): DataTableColumns<EmailLog> => {
  return [
    {
      type: 'selection'
    },
    {
      title: 'Uid',
      key: 'uid',
      width: 150
    },
    {
      title: '标题',
      key: 'subject',
      width: 250
    },
    {
      title: '邮件内容',
      key: 'content',
      width: 300,
      render(row) {
        return h(
          NEllipsis,
          {
            lineClamp: 2,
            tooltip: false
          },
          {
            default: () => row.content
          }
        );
      }
    },
    {
      title: '发送者',
      key: 'sender',
      width: 200
    },
    {
      title: '收件人',
      key: 'receiver',
      width: 200
    },
    {
      title: '状态',
      key: 'send',
      width: 170,
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: row.send ? 'success' : 'error'
          },
          {
            default: () => (row.send ? '已成功发送' : '发送失败')
          }
        );
      }
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: 200
    },
    {
      title: '最后更新时间',
      key: 'updateTime',
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
                onClick: () => deleteEmailLog(row)
              },
              { default: () => '删除' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                ghost: true,
                onClick: () => showEmailLog(row)
              },
              { default: () => '查看' }
            )
          )
        );
      }
    }
  ];
};

const obj = reactive({
  condition: new Condition(null, null, null),
  showData: new Array<EmailLog>(),
  showDrawer: false,
  currentEmailLog: new EmailLog(),
  pageTotal: 0
});

const loadAllEmailLog = () => {
  fetchAllEmailLog(obj.condition).then(data => {
    obj.showData = data.data.result;
    obj.pageTotal = data.data.total;
  });
};

const columns = createColumns({
  deleteEmailLog(row) {
    // 删除邮箱记录
    deleteEmailLogByUid(row.uid as string).then(data => {
      message.success('删除成功');
      loadAllEmailLog();
    });
  },
  showEmailLog(row) {
    obj.currentEmailLog = row;
    obj.showDrawer = true;
  }
});

onBeforeMount(() => {
  loadAllEmailLog();
});

const changePageSize = (pageSize: number) => {
  obj.condition.pageSize = pageSize;
  loadAllEmailLog();
};
const changeCurrentPage = (page: number) => {
  obj.condition.pageNum = page;
  // 重新加载数据
  loadAllEmailLog();
};

onMounted(() => {
  emitter.on('globalSearchCondition', e => {
    const originCondition = obj.condition;
    obj.condition = e as Condition;
    obj.condition.pageSize = originCondition.pageSize;
    obj.condition.pageNum = originCondition.pageNum;
    loadAllEmailLog();
  });
});

/** 重新发送邮件 */
const resendMail = () => {
  loadingBar.start();
  resendCustomHtmlMailByUid(obj.currentEmailLog.uid as string).then(data => {
    if (data.success) {
      loadingBar.finish();
      message.success('发送成功');
      loadAllEmailLog();
    } else {
      loadingBar.error();
    }
  });
};
</script>
