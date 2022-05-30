<template>
  <n-space :vertical="true" :size="16">
    <n-card title="登录日志" size="huge" class="h-full shadow-sm rounded-16px">
      <n-table striped>
        <thead>
          <tr>
            <th>用户名</th>
            <th>登录IP</th>
            <th>登录地点</th>
            <th>操作系统信息</th>
            <th>登录状态</th>
            <th>消息</th>
            <th>登录时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in obj.loginLogDataArr" :key="index">
            <td>{{ item.username }}</td>
            <td>{{ item.loginIp }}</td>
            <td>{{ item.loginLocation }}</td>
            <td>
              <n-ellipsis :line-clamp="1">
                {{ item.operationSystemInfo }}
              </n-ellipsis>
            </td>
            <td>
              <n-tag :type="item.status ? 'success' : 'error'">
                {{ item.status ? '登录成功' : '登录失败' }}
              </n-tag>
            </td>
            <td>
              {{ item.message }}
            </td>
            <td>{{ item.createTime }}</td>
            <td>
              <n-space>
                <n-popconfirm @positive-click="handleDeleteLoginLogClick(item.uid, item.username)">
                  <template #trigger>
                    <n-button>删除</n-button>
                  </template>
                  删除{{ item.username }}么?
                </n-popconfirm>
              </n-space>
            </td>
          </tr>
        </tbody>
      </n-table>

      <template #action>
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
      </template>
      <template #header-extra>
        <n-space> </n-space>
      </template>
    </n-card>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import { fetchAllUser, deleteLoginLogByUid, fetchAllLoginLog } from '@/service';
import { Condition } from '@/theme';
import emitter from '@/utils/mitt';
import { LoginLog } from '@/theme/auth';

export default defineComponent({
  setup(props, context) {
    const message = useMessage();
    const obj = reactive({
      number: 1,
      // 总条目数
      pageTotal: 0,
      // 总页数
      pageCount: 0,
      loginLogDataArr: new Array<LoginLog>(),
      condition: new Condition(null, null, null)
    });

    // 数据
    // 方法
    const loadLoginLogData = () => {
      fetchAllLoginLog(obj.condition).then(data => {
        obj.pageTotal = data.data.total;
        obj.loginLogDataArr = data.data.result;
      });
    };
    const handleDeleteLoginLogClick = (loginLogUid: string, username: string) => {
      deleteLoginLogByUid(loginLogUid).then(data => {
        if (data.success) {
          // 重新加载用户数据
          loadLoginLogData();
          message.success(`成功删除 ${username} 用户的登录信息`);
        }
      });
    };
    const changePageSize = (pageSize: number) => {
      obj.condition.pageSize = pageSize;
      loadLoginLogData();
    };
    const changeCurrentPage = (page: number) => {
      obj.condition.pageNum = page;
      // 重新加载数据
      loadLoginLogData();
    };

    onMounted(() => {
      emitter.on('globalSearchCondition', e => {
        const originCondition = obj.condition;
        obj.condition = e as Condition;
        obj.condition.pageSize = originCondition.pageSize;
        obj.condition.pageNum = originCondition.pageNum;
        loadLoginLogData();
      });
    });

    return {
      obj,
      handleDeleteLoginLogClick,
      loadLoginLogData,
      changePageSize,
      changeCurrentPage
    };
  },
  created() {
    this.obj.condition.delete = false;
    this.obj.condition.pageSize = 10;
    this.loadLoginLogData();
  }
});
</script>
<style scoped></style>
