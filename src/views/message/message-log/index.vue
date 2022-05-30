<template>
  <n-card class="h-full shadow-sm rounded-16px">
    <n-drawer v-model:show="obj.showDrawer" width="calc(35vw)" placement="right">
      <n-drawer-content title="RabbitMQ">
        <n-card :bordered="false">
          <n-code
            :hljs="hljs"
            :word-wrap="true"
            :code="JSON.stringify(JSON.parse(obj.currentMessageLog.message), null, 4)"
            language="json"
          />
        </n-card>

        <template #footer>
          <n-space :size="30">
            <n-button type="primary" ghost @click="resendMqMessage">重新投递</n-button>
            <n-button type="primary" :disabled="obj.currentMessageLog.ackStatus" ghost @click="ackMessage"
              >应答</n-button
            >
            <n-button type="primary" ghost :disabled="obj.currentMessageLog.consumeStatus" @click="consumerMessage"
              >消费</n-button
            >
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
import { NTag, NButton, useMessage, DataTableColumns, NEllipsis, NSpace, useLoadingBar, NText } from 'naive-ui';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import { deleteEmailLogByUid, fetchAllEmailLog, resendCustomHtmlMailByUid } from '@/service';
import { EmailLog } from '@/theme/message/emailLog';
import { Condition } from '@/theme';
import emitter from '@/utils/mitt';
import {
  deleteMessageLog,
  fetchAllMessageLog,
  resendRabbitMqMessage,
  updateMessageLog
} from '@/service/api/message/messageLog';
import { MessageLog } from '@/theme/message/messageLog';

hljs.registerLanguage('json', json);

const message = useMessage();
const loadingBar = useLoadingBar();
const createColumns = ({
  deleteMessageLog,
  showMessageLog
}: {
  deleteMessageLog: (rowData: MessageLog) => void;
  showMessageLog: (rowData: MessageLog) => void;
}): DataTableColumns<MessageLog> => {
  return [
    {
      type: 'selection'
    },
    {
      title: 'Uid',
      key: 'uid',
      width: 230
    },
    {
      title: '应答状态',
      key: 'send',
      width: 170,
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: row.ackStatus ? 'success' : 'error'
          },
          {
            default: () => (row.ackStatus ? '已成功投递' : '投递失败')
          }
        );
      }
    },
    {
      title: '消费状态',
      key: 'consumeStatus',
      width: 170,
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: row.consumeStatus ? 'success' : 'error'
          },
          {
            default: () => (row.consumeStatus ? '已消费' : '未消费')
          }
        );
      }
    },
    {
      title: '错误消息',
      key: 'errorMessage',
      width: 200,
      render(row) {
        return h(
          NEllipsis,
          {
            lineClamp: 1
          },
          Array.of(
            h(
              NText,
              {
                style: {
                  marginRight: '6px'
                },
                type: 'error'
              },
              {
                default: () => row.errorMessage
              }
            )
          )
        );
      }
    },
    {
      title: '交换机',
      key: 'exchange',
      width: 250,
      render(row) {
        return h(
          NEllipsis,
          {
            lineClamp: 1,
            tooltip: false
          },
          {
            default: () => row.exchange
          }
        );
      }
    },
    {
      title: '尝试重发次数',
      key: 'tryCount',
      width: 150
    },
    {
      title: '交换机类型',
      key: 'exchangeType',
      width: 100,
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'info'
          },
          {
            default: () => row.exchangeType
          }
        );
      }
    },
    {
      title: '路由',
      key: 'routingKey',
      width: 200,
      render(row) {
        return h(
          NEllipsis,
          {
            lineClamp: 1,
            tooltip: false
          },
          {
            default: () => row.routingKey
          }
        );
      }
    },
    {
      title: '消息内容',
      key: 'message',
      width: 450,
      render(row) {
        return h(
          NEllipsis,
          {
            lineClamp: 1,
            tooltip: false
          },
          {
            default: () => row.message
          }
        );
      }
    },
    {
      title: '队列',
      key: 'queue',
      width: 100
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
                onClick: () => deleteMessageLog(row)
              },
              { default: () => '删除' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                ghost: true,
                onClick: () => showMessageLog(row)
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
  showData: new Array<MessageLog>(),
  showDrawer: false,
  currentMessageLog: new MessageLog(),
  pageTotal: 0
});

const loadAllMessageLog = () => {
  fetchAllMessageLog(obj.condition).then(data => {
    obj.showData = data.data.result;
    obj.pageTotal = data.data.total;
  });
};

const columns = createColumns({
  deleteMessageLog(row) {
    // 删除邮箱记录
    deleteMessageLog(row.uid as string).then(data => {
      message.success('删除成功');
      loadAllMessageLog();
    });
  },
  showMessageLog(row) {
    obj.currentMessageLog = row;
    obj.showDrawer = true;
  }
});

onBeforeMount(() => {
  loadAllMessageLog();
});

const changePageSize = (pageSize: number) => {
  obj.condition.pageSize = pageSize;
  loadAllMessageLog();
};
const changeCurrentPage = (page: number) => {
  obj.condition.pageNum = page;
  // 重新加载数据
  loadAllMessageLog();
};

onMounted(() => {
  emitter.on('globalSearchCondition', e => {
    const originCondition = obj.condition;
    obj.condition = e as Condition;
    obj.condition.pageSize = originCondition.pageSize;
    obj.condition.pageNum = originCondition.pageNum;
    loadAllMessageLog();
  });
});

/** 重新发送邮件 */
const resendMqMessage = () => {
  loadingBar.start();
  resendRabbitMqMessage(obj.currentMessageLog.uid as string).then(data => {
    if (data.success) {
      loadingBar.finish();
      message.success('投递成功');
      loadAllMessageLog();
    } else {
      loadingBar.error();
    }
  });
};

const ackMessage = () => {
  // 设置应答状态为true
  const { currentMessageLog } = obj;
  currentMessageLog.ackStatus = true;
  updateMessageLog(currentMessageLog).then(data => {
    if (data.success) {
      message.success('应答成功');
    }
  });
};

const consumerMessage = () => {
  // 设置消费状态为true
  const { currentMessageLog } = obj;
  currentMessageLog.consumeStatus = true;
  updateMessageLog(currentMessageLog).then(data => {
    if (data.success) {
      message.success('消费成功');
    }
  });
};
</script>
