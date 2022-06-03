<template>
  <div>
    <n-drawer v-model:show="obj.showDrawer" :width="502" placement="left">
      <n-drawer-content :title="obj.isUpdateInfo ? '修改类别' : '添加类别'">
        <n-space vertical :size="28">
          <n-space vertical :size="14">
            <n-text> 类别名称 </n-text>
            <n-input
              v-model:value="obj.currentCategory.title"
              :minlength="4"
              :maxlength="254"
              round
              placeholder="email"
            />
          </n-space>

          <n-space vertical :size="14">
            <n-text> 关联的资源 </n-text>
            <n-input
              v-model:value="obj.currentCategory.title"
              :minlength="4"
              :maxlength="254"
              round
              placeholder="email"
            />
          </n-space>

          <n-space vertical :size="14">
            <n-text> 封面 </n-text>
            <n-input
              v-model:value="obj.currentCategory.coverUrl"
              :minlength="2"
              round
              placeholder="请到文件管理处，上传图片，然后在这里填入图片地址"
            />
            <n-image
              v-show="obj.currentCategory.coverUrl"
              :src="obj.currentCategory.coverUrl"
              fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
          </n-space>

          <n-space vertical :size="14">
            <n-text> 描述 </n-text>
            <n-input v-model:value="obj.currentCategory.summary" type="textarea" round placeholder="类别描述" />
          </n-space>

          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: right">
                <n-button round type="primary" @click="handleSaveCategoryInfo">
                  {{ obj.isUpdateInfo ? '更新' : '添加' }}
                </n-button>
              </div>
            </n-col>
          </n-row>
        </n-space>
      </n-drawer-content>
    </n-drawer>
    <n-space :vertical="true" :size="16">
      <n-card title="用户管理" size="huge" class="h-full shadow-sm rounded-16px">
        <n-table striped>
          <thead>
            <tr>
              <th>封面</th>
              <th>名称</th>
              <th>描述</th>
              <th>是否删除</th>
              <th>创建时间</th>
              <th>最后更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in obj.categoryDataArr" :key="index">
              <td>
                <n-avatar size="large" fallback-src="https://picture.xcye.xyz/avatar.jpg" :src="item.coverUrl" />
              </td>
              <td>{{ item.title }}</td>
              <td :width="400">
                <n-ellipsis :line-clamp="1">
                  {{ item.summary }}
                </n-ellipsis>
              </td>
              <td>
                <n-tag :type="item.delete ? 'error' : 'success'">{{ item.delete ? '已删除' : '未删除' }}</n-tag>
              </td>
              <td>
                {{ item.createTime }}
              </td>
              <td>
                {{ item.updateTime }}
              </td>
              <td>
                <n-space>
                  <n-popconfirm @positive-click="handleDeleteCategoryClick(item.uid, item.title)">
                    <template #trigger>
                      <n-button>删除</n-button>
                    </template>
                    删除{{ item.title }}么?
                  </n-popconfirm>
                  <n-button @click="clickModifyCategoryInfo(item)">编辑</n-button>
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
            <n-button strong secondary tertiary round type="success" @click="addCategory"> 添加邮箱</n-button>
          </n-space>
        </template>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, reactive, computed, onMounted, onBeforeMount } from 'vue';
import { useMessage, useLoadingBar } from 'naive-ui';
import { useAuthStore } from '@/store';
import {
  fetchAllUser,
  deleteUserByUserUid,
  fetchAllEmail,
  deleteEmailByUid,
  sendCustomHtmlMail,
  fetchAllCategory,
  deleteCategory,
  updateCategory,
  insertCategory,
  fetchArticleByCondition
} from '@/service';
import { fetchEmailByUid } from '@/service/api/message/email';
import { Condition, User } from '@/theme';
import emitter from '@/utils/mitt';
import { Email } from '@/theme/message';
import { Category } from '@/theme/article/category';
import { Article } from '@/theme/article/article';
import { Link } from '@/theme/article/link';

const auth = useAuthStore();
const obj = reactive({
  number: 1,
  // 总条目数
  pageTotal: 0,
  // 总页数
  pageCount: 0,
  categoryDataArr: new Array<Category>(),
  currentCategory: new Category(),
  condition: new Condition(false, null, null),
  showDrawer: false,
  isUpdateInfo: false,
  relatedArticleArr: new Array<Article>(),
  relatedLinkArr: new Array<Link>()
});

// 数据
// 方法
const loadCategoryData = () => {
  fetchAllCategory(obj.condition).then(data => {
    // 设置第一个用户对象
    if (data.data.result.length > 0) {
      const category = data.data.result[0];
      obj.currentCategory = category;
    }

    obj.pageTotal = data.data.total;
    obj.categoryDataArr = data.data.result;
  });
};
const handleDeleteCategoryClick = (categoryUid: string, title: string) => {
  deleteCategory(categoryUid).then(data => {
    if (data.success) {
      window.$message?.success(`删除类别 ${title} 成功`);
      loadCategoryData();
    }
  });
};
const changePageSize = (pageSize: number) => {
  obj.condition.pageSize = pageSize;
  loadCategoryData();
};
const changeCurrentPage = (page: number) => {
  obj.condition.pageNum = page;
  // 重新加载数据
  loadCategoryData();
};
const clickModifyCategoryInfo = (category: Category) => {
  obj.currentCategory = category;
  obj.showDrawer = true;
  obj.isUpdateInfo = true;
};

onBeforeMount(() => {
  loadCategoryData();
});

onMounted(() => {
  emitter.on('globalSearchCondition', e => {
    const originCondition = obj.condition;
    obj.condition = e as Condition;
    obj.condition.pageSize = originCondition.pageSize;
    obj.condition.pageNum = originCondition.pageNum;
    loadCategoryData();
  });
});

const handleSaveCategoryInfo = () => {
  // 校验
  if (!obj.currentCategory.title) {
    window.$message?.error('必须要输入类别名称');
    return;
  }

  if (obj.isUpdateInfo) {
    updateCategory(obj.currentCategory).then(data => {
      if (data.success) {
        window.$message?.success('修改成功');
        loadCategoryData();
        obj.showDrawer = false;
      }
    });
  } else {
    obj.currentCategory.userUid = auth.getAuthUserInfo.userUid;
    insertCategory(obj.currentCategory).then(data => {
      if (data.success) {
        window.$message?.success('添加成功');
        loadCategoryData();
        obj.showDrawer = false;
      }
    });
  }
};

const addCategory = () => {
  obj.isUpdateInfo = false;
  obj.showDrawer = true;
  obj.currentCategory = new Category();
};
</script>
<style scoped></style>
