<template>
  <n-space :vertical="true" :size="16">
    <n-card title="用户管理" size="huge" class="h-full shadow-sm rounded-16px">
      <n-table striped>
        <thead>
          <tr>
            <th>用户名</th>
            <th>邮箱</th>
            <th>主机号</th>
            <th>密码</th>
            <th>协议</th>
            <th>端口</th>
            <th>创建时间</th>
            <th>最后更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in obj.emailDataArr" :key="index">
            <td>{{ item.username }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.emailHost }}</td>
            <td>暂时未增加</td>
            <td>
              {{ item.protocol }}
            </td>
            <td>
              {{ item.port }}
            </td>
            <td>{{ item.createTime }}</td>
            <td>{{ item.updateTime }}</td>
            <td>
              <n-space>
                <n-popconfirm @positive-click="handleDeleteEmailClick(item.uid, item.email)">
                  <template #trigger>
                    <n-button>删除</n-button>
                  </template>
                  删除{{ item.email }}么?
                </n-popconfirm>
                <n-button @click="clickModifyEmailInfo(item)">编辑</n-button>
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
      <template #header>
        <n-space>
          <n-button strong secondary tertiary round type="success" @click="addUserInfo"> 添加邮箱</n-button>
        </n-space>
      </template>
    </n-card>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import { fetchAllUser, deleteUserByUserUid, fetchAllEmail, deleteEmailByUid } from '@/service';
import { fetchEmailByUid } from '@/service/api/message/email';
import { Condition, User } from '@/theme';
import emitter from '@/utils/mitt';
import { Email } from '@/theme/message';

export default defineComponent({
  setup(props, context) {
    const message = useMessage();
    const obj = reactive({
      number: 1,
      // 总条目数
      pageTotal: 0,
      // 总页数
      pageCount: 0,
      emailDataArr: new Array<Email>(),
      currentEmail: new Email(),
      condition: new Condition(null, null, null)
    });

    async function loadEmailByUid(emailUid: string): Email {
      const email = await fetchEmailByUid(emailUid);
      return email.data;
    }

    // 数据
    // 方法
    const loadEmailData = () => {
      fetchAllEmail(obj.condition).then(data => {
        // 设置第一个用户对象
        if (data.data.result.length > 0) {
          const email = data.data.result[0];
          obj.currentEmail = email;
        }

        if (data.success) {
          obj.pageTotal = data.data.total;
          obj.emailDataArr = data.data.result;
        }
      });
    };
    const handleDeleteEmailClick = (emailUid: string, email: string) => {
      deleteEmailByUid(emailUid).then(data => {
        if (data.success) {
          // 重新加载用户数据
          loadEmailData();
          message.success(`成功删除 ${email} 信息`);
        }
      });
    };
    const changePageSize = (pageSize: number) => {
      obj.condition.pageSize = pageSize;
      loadEmailData();
    };
    const changeCurrentPage = (page: number) => {
      obj.condition.pageNum = page;
      // 重新加载数据
      loadEmailData();
    };
    const clickModifyEmailInfo = (emailInfo: Email) => {
      obj.currentEmail = emailInfo;
      emitter.emit('clickModifyEmailInfo', {
        updateEmailInfo: true,
        currentEmailInfo: emailInfo
      });
    };
    const addUserInfo = () => {
      emitter.emit('clickModifyEmailInfo', {
        updateEmailInfo: false,
        currentEmailInfo: new Email()
      });
    };

    onMounted(() => {
      emitter.on('reloadEmailData', e => {
        loadEmailData();
      });

      emitter.on('globalSearchCondition', e => {
        const originCondition = obj.condition;
        obj.condition = e as Condition;
        obj.condition.pageSize = originCondition.pageSize;
        obj.condition.pageNum = originCondition.pageNum;
        loadEmailData();
      });
    });

    return {
      obj,
      handleDeleteEmailClick,
      loadEmailData,
      changePageSize,
      changeCurrentPage,
      clickModifyEmailInfo,
      addUserInfo
    };
  },
  created() {
    this.obj.condition.delete = false;
    this.obj.condition.pageSize = 10;
    this.loadEmailData();
  }
});
</script>
<style scoped></style>
