<template>
  <div>
    <n-drawer v-model:show="obj.showDrawer" :width="502" placement="left">
      <n-drawer-content title="编辑友情链接">
        <n-space vertical :size="28">
          <n-descriptions label-placement="top" title="站点标题" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-input
                  v-model:value="obj.currentLinkInfo.linkTitle"
                  type="text"
                  placeholder="站点标题"
                  round
                  clearable
                />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="top" title="站点地址" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-input
                  v-model:value="obj.currentLinkInfo.linkUrl"
                  type="text"
                  placeholder="站点地址"
                  round
                  clearable
                />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="top" title="Logo" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-input v-model:value="obj.currentLinkInfo.linkLogo" type="text" placeholder="Logo" round clearable />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="top" title="邮箱" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-input v-model:value="obj.currentLinkInfo.email" type="text" placeholder="email" round clearable />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="top" title="归档" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-select v-model:value="obj.currentLinkInfo.categoryName" :options="obj.categoryOption" />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="left" label-align="left" :column="2" size="large" separator="  ">
            <n-descriptions-item label-style="font-size: 1.3rem;">
              <template #label>审核状态</template>
              <template #default>
                <n-switch
                  v-model:value="obj.currentLinkInfo.publish"
                  :default-value="obj.currentLinkInfo.publish"
                  size="medium"
                  @update:value="updatePublishStatus"
                />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-descriptions label-placement="top" title="留言信息" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-input v-model:value="obj.msg" type="textarea" placeholder="留言，会附加到邮箱信息中" />
              </template>
            </n-descriptions-item>
          </n-descriptions>

          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: right">
                <n-space>
                  <n-button round type="primary" @click="handleSaveLinkInfo">
                    {{ !obj.isAddLink ? '更新' : '添加' }}
                  </n-button>
                  <n-button round type="error" :disabled="obj.isAddLink" @click="handleDeleteLinkInfo"> 删除 </n-button>
                </n-space>
              </div>
            </n-col>
          </n-row>

          <n-divider dashed> 额外信息 </n-divider>

          <n-descriptions label-placement="top" title="QQ" :column="1" size="large">
            <n-descriptions-item>
              <template #default>
                <n-input v-model:value="obj.currentLinkInfo.qqNumber" type="text" placeholder="QQ" round clearable />
              </template>
            </n-descriptions-item>
          </n-descriptions>
        </n-space>
      </n-drawer-content>
    </n-drawer>
    <n-card size="huge" class="h-full shadow-sm rounded-16px">
      <n-tabs type="line" animated @update:value="toggleTagPane">
        <n-tab-pane name="hadPublish" tab="已审核">
          <n-data-table :columns="columns" :data="obj.linkArr" />
        </n-tab-pane>
        <n-tab-pane name="noPublish" tab="待审核">
          <n-data-table :columns="columns" :data="obj.linkArr" />
        </n-tab-pane>
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
      <template #header>
        <n-space>
          <n-button strong secondary tertiary round type="success" @click="addLinkInfo"> 添加</n-button>
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
  NSwitch,
  NTag,
  NText,
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadInst
} from 'naive-ui';
import { useClipboard } from '@vueuse/core';
import { router } from '@/router';
import { useAuthStore } from '@/store';
import {
  deleteArticleByUid,
  deleteLinkByUid,
  fetchAllCategory,
  fetchArticleByCondition,
  fetchLinkByCondition,
  insertLinkInfo,
  updateArticle,
  updateLink,
  updateLinkPublishStatus
} from '@/service';
import { Condition } from '@/theme';
import emitter from '@/utils/mitt';
import { Article } from '@/theme/article/article';
import { Link } from '@/theme/article/link';

const { copy, isSupported } = useClipboard();

interface CategoryOption {
  label: string;
  value: string;
}
const auth = useAuthStore();
const obj = reactive({
  /** 图片文件的后缀名 */
  linkArr: new Array<Link>(),
  condition: new Condition(false, true, true),
  showDrawer: false,
  currentLinkInfo: new Link(),
  pageTotal: 0,
  msg: '',
  isAddLink: false,
  categoryOption: new Array<CategoryOption>(),
  linkCategoryName: ''
});

const addLinkInfo = () => {
  obj.isAddLink = true;
  obj.showDrawer = true;
  obj.currentLinkInfo = new Link();
};

const loadAllLinkData = () => {
  obj.linkArr = new Array<Link>();
  obj.categoryOption = new Array<CategoryOption>();
  fetchLinkByCondition(obj.condition).then(data => {
    obj.pageTotal = data.data.total;
    data.data.result.forEach(value => obj.linkArr.push(value));
  });

  // 加载类别
  const condition = new Condition(false, true, true);
  condition.pageSize = 100000;

  fetchAllCategory(condition).then(data => {
    data.data.result.forEach(category => obj.categoryOption.push({ label: category.title, value: category.title }));
  });
};

onBeforeMount(() => {
  // 发送请求，获取图片数据
  loadAllLinkData();
});

const showLinkDetails = (linkInfo: Link) => {
  obj.currentLinkInfo = linkInfo;
  // 调用接口，查询该UserUid对应的用户名
  obj.isAddLink = false;
  obj.showDrawer = true;
};

const handleUpdateArticleInfo = () => {};

// 删除文件
const handleDeleteLinkInfo = () => {
  if (!obj.msg) {
    window.$message?.error('必须要有留言');
    return;
  }
  deleteLinkByUid(obj.currentLinkInfo.uid as string, obj.msg).then(data => {
    if (data.success) {
      window.$message?.success(`已删除 ${obj.currentLinkInfo.linkTitle} 的友情链接`);
      loadAllLinkData();
      obj.showDrawer = false;
    }
  });
};

const handleSaveLinkInfo = () => {
  if (!obj.currentLinkInfo.email) {
    window.$message?.error('必须要有email');
    return;
  }

  if (!obj.currentLinkInfo.linkUrl) {
    window.$message?.error('必须要有站点地址');
    return;
  }

  if (!obj.currentLinkInfo.linkTitle) {
    window.$message?.error('必须要有站点标题');
    return;
  }

  if (obj.isAddLink) {
    obj.currentLinkInfo.userUid = auth.getAuthUserInfo.userUid as string;
    // 新增
    insertLinkInfo(obj.currentLinkInfo).then(data => {
      if (data.success) {
        window.$message?.success('添加友情链接成功');
        loadAllLinkData();
        obj.showDrawer = false;
      }
    });
  } else {
    // 修改
    updateLink(obj.currentLinkInfo).then(data => {
      if (data.success) {
        window.$message?.success('更新友情链接信息成功');
        obj.showDrawer = false;
      }
    });
  }
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

const changePageSize = (pageSize: number) => {
  obj.condition.pageSize = pageSize;
  loadAllLinkData();
};
const changeCurrentPage = (page: number) => {
  obj.condition.pageNum = page;
  // 重新加载数据
  loadAllLinkData();
};

// onMounted(() => {
//   emitter.on('globalSearchCondition', e => {
//     const originCondition = obj.condition;
//     obj.condition = e as Condition;
//     obj.condition.pageSize = originCondition.pageSize;
//     obj.condition.pageNum = originCondition.pageNum;
//     loadAllLinkData();
//   });
// });

const updatePublishStatus = (value: boolean) => {
  if (obj.isAddLink) {
    obj.currentLinkInfo.publish = !value;
    window.$message?.error('添加友联不支持审核');
    return;
  }
  if (!obj.isAddLink) {
    if (!obj.msg) {
      obj.currentLinkInfo.publish = !value;
      window.$message?.error('必须要有留言');
      return;
    }
  }
  obj.currentLinkInfo.publish = value;
  // 更新数据
  updateLinkPublishStatus(obj.msg, obj.currentLinkInfo.publish, obj.currentLinkInfo.uid as string).then(data => {
    if (data.success) {
      // 修改成功
      window.$message?.success(`已修改该友情链接的状态为 ${value ? '发布' : '下架'}`);
      loadAllLinkData();
    } else {
      obj.currentLinkInfo.publish = !value;
    }
  });
};

const toggleTagPane = (value: string) => {
  if (value === 'noPublish') {
    // 加载待审核的数据
    obj.condition.status = false;
    loadAllLinkData();
  } else {
    // 已经审核通过的数据
    obj.condition.status = true;
    loadAllLinkData();
  }
};

const createColumns = (): DataTableColumns<Link> => {
  return [
    {
      type: 'selection'
    },
    {
      title: 'Logo',
      key: 'linkLogo',
      width: 100,
      render(row) {
        return h(NAvatar, {
          src: row.linkLogo as string,
          round: false
        });
      }
    },
    {
      title: '标题',
      key: 'linkTitle',
      width: 250,
      render(row) {
        return h(
          NEllipsis,
          {
            lineClamp: 1
          },
          {
            default: () => row.linkTitle
          }
        );
      }
    },
    {
      title: '站点',
      key: 'linkUrl',
      width: 250,
      render(row) {
        return h(
          'a',
          {
            href: row.linkUrl,
            target: '_blank'
          },
          [
            h(
              NText,
              {
                type: 'primary'
              },
              {
                default: () => row.linkUrl
              }
            )
          ]
        );
      }
    },
    {
      title: '邮箱',
      key: 'email',
      width: 250,
      render(row) {
        return h(
          NTag,
          {
            checkable: true,
            onClick: () => copyContent(row.email)
          },
          {
            default: () => row.email
          }
        );
      }
    },
    {
      title: 'QQ',
      key: 'qqNumber',
      width: 250,
      render(row) {
        return h(
          NTag,
          {
            checkable: true,
            onClick: () => copyContent(row.qqNumber)
          },
          {
            default: () => row.qqNumber
          }
        );
      }
    },
    {
      title: '描述',
      key: 'linkDescription',
      width: 250,
      render(row) {
        return h(
          NEllipsis,
          {
            type: 'primary'
          },
          {
            default: () => row.linkDescription
          }
        );
      }
    },
    {
      title: '发布状态',
      key: 'publish',
      width: 150,
      render(row) {
        return h(
          NTag,
          {
            type: row.publish ? 'primary' : 'error'
          },
          {
            default: () => (row.publish ? '已审核' : '待审核')
          }
        );
      }
    },
    {
      title: '分类',
      key: 'categoryName',
      width: 100,
      render(row) {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'primary'
          },
          {
            default: () => row.categoryName
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
      title: '最后修改时间',
      key: 'updateTime',
      width: 200
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
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
                type: 'primary',
                ghost: true,
                onClick: () => showLinkDetails(row as Link)
              },
              { default: () => '编辑' }
            )
          )
        );
      }
    }
  ];
};

const columns = createColumns();
</script>
