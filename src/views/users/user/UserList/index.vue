<template>
  <n-space :vertical="true" :size="16">
    <n-card title="用户管理" size="huge" class="h-full shadow-sm rounded-16px">
      <n-table striped>
        <thead>
          <tr>
            <th>用户名</th>
            <th>昵称</th>
            <th>是否删除</th>
            <th>账户状态</th>
            <th>站点Uid</th>
            <th>邮箱</th>
            <th>邮箱绑定状态</th>
            <th>创建时间</th>
            <th>最后更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in obj.userDataArr" :key="index">
            <td>{{ item.username }}</td>
            <td>{{ item.nickname }}</td>
            <td>
              <n-tag :type="!item.delete ? 'success' : 'error'">
                {{ item.delete ? '已删除' : '未删除' }}
              </n-tag>
            </td>
            <td>
              <n-tag :type="!item.accountLock ? 'success' : 'error'">
                {{ item.accountLock ? '被锁住' : '正常' }}
              </n-tag>
            </td>
            <td>{{ item.siteUid }}</td>
            <td>{{ getUserEmail(item.emailUid) }}</td>
            <td>
              <n-tag :type="item.verifyEmail ? 'success' : 'error'">
                {{ item.verifyEmail ? '已绑定' : '未绑定' }}
              </n-tag>
            </td>
            <td>{{ item.createTime }}</td>
            <td>{{ item.updateTime }}</td>
            <td>
              <n-space>
                <n-popconfirm @positive-click="handleDeleteUserClick(item.uid, item.username)">
                  <template #trigger>
                    <n-button>删除</n-button>
                  </template>
                  删除{{ item.username }}么?
                </n-popconfirm>
                <n-button @click="clickModifyUserInfo(item)">编辑</n-button>
                <n-dropdown :options="obj.options">
                  <n-button>用户资料</n-button>
                </n-dropdown>
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
        <div>这是头部额外区域</div>
      </template>
      <template #header>
        <n-space>
          <n-button strong secondary tertiary round type="success" @click="addUser"> 添加用户</n-button>
        </n-space>
      </template>
    </n-card>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useMessage } from 'naive-ui';
import {
  fetchAllUser,
  deleteUserByUserUid,
  addUser,
  physicsDeleteUser,
  updateUser,
  bindEmailForUser,
  fetchUserByUsername,
  fetchUserByUsernameContainPassword,
  fetchUserByUserUid
} from '@/service';
import { fetchEmailByUid } from '@/service/api/email';
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
      userDataArr: new Array<User>(),
      currentUser: new User(),
      options: [
        {
          label: '用户资料',
          key: 'profile'
        },
        {
          label: '编辑用户资料',
          key: 'editProfile'
        },
        {
          label: '退出登录',
          key: 'logout'
        }
      ],
      condition: new Condition()
    });

    async function loadEmailByUid(emailUid: string): Email {
      const email = await fetchEmailByUid(emailUid);
      return email.data;
    }

    // 数据
    const getUserEmail = computed(() => {
      return (emailUid: string) => {
        if (emailUid !== null && emailUid !== undefined) {
          const { email } = loadEmailByUid(emailUid);
          return email === undefined ? '无效uid' : email;
        }
        return '未绑定';
      };
    });
    return {
      obj,
      getUserEmail,
      loadUserData() {
        fetchAllUser(obj.condition).then(data => {
          // 设置第一个用户对象
          if (data.data.result.length > 0) {
            const user = data.data.result[0];
            obj.currentUser = user;
          }

          if (data.success) {
            obj.pageTotal = data.data.total;
            obj.userDataArr = data.data.result;
          }
        });
      },
      handleDeleteUserClick(userUid: string, username: string) {
        deleteUserByUserUid<Service.SuccessResult>(userUid).then(data => {
          if (data.success) {
            // 重新加载用户数据
            this.loadUserData();
            message.success(`成功删除 ${username} 用户`);
          }
        });
      },

      changePageSize(pageSize: number) {
        obj.condition.pageSize = pageSize;
        this.loadUserData();
      },
      changeCurrentPage(page: number) {
        obj.condition.pageNum = page;
        // 重新加载数据
        this.loadUserData();
      },
      clickModifyUserInfo(userInfo: User) {
        obj.currentUser = userInfo;
        emitter.emit('clickModifyUserInfo', {
          updateUserInfo: true,
          currentUserInfo: userInfo
        });
      },
      addUser() {
        emitter.emit('clickModifyUserInfo', {
          updateUserInfo: false,
          currentUserInfo: new User()
        });
      }
    };
  },
  created() {
    this.loadUserData();
  }
});
</script>
<style scoped></style>
