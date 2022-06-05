<template>
  <div>
    <n-card size="huge" class="h-full shadow-sm rounded-16px">
      <n-data-table :columns="columns" :data="obj.articleArr" />
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
  NText,
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadInst
} from 'naive-ui';
import { useClipboard } from '@vueuse/core';
import { router } from '@/router';
import { deleteArticleByUid, fetchArticleByCondition, updateArticle } from '@/service';
import { Condition } from '@/theme';
import emitter from '@/utils/mitt';
import { Article } from '@/theme/article/article';

const obj = reactive({
  /** 图片文件的后缀名 */
  articleArr: new Array<Article>(),
  condition: new Condition(false, true, true),
  showDrawer: false,
  currentArticleInfo: new Article(),
  pageTotal: 0
});

const loadAllArticle = () => {
  obj.articleArr = new Array<Article>();
  fetchArticleByCondition(obj.condition).then(data => {
    obj.pageTotal = data.data.total;
    data.data.result.forEach(value => obj.articleArr.push(value));
  });
};

onBeforeMount(() => {
  // 发送请求，获取图片数据
  loadAllArticle();
});

const showArticleDetails = (article: Article) => {
  obj.currentArticleInfo = article;
  // 调用接口，查询该UserUid对应的用户名
  router.push(`/article/edit-article?uid=${article.uid}`);
};

const handleUpdateArticleInfo = () => {};

// 删除文件
const handleDeleteArticleInfo = (article: Article) => {
  deleteArticleByUid(article.uid as string).then(data => {
    if (data.success) {
      window.$message?.success(`已删除 ${article.title} 该篇文章`);
      loadAllArticle();
    }
  });
};

const handleUploadArticleChange = (options: { fileList: UploadFileInfo[] }) => {};

const changePageSize = (pageSize: number) => {
  obj.condition.pageSize = pageSize;
  loadAllArticle();
};
const changeCurrentPage = (page: number) => {
  obj.condition.pageNum = page;
  // 重新加载数据
  loadAllArticle();
};

onMounted(() => {
  emitter.on('globalSearchCondition', e => {
    const originCondition = obj.condition;
    obj.condition = e as Condition;
    obj.condition.pageSize = originCondition.pageSize;
    obj.condition.pageNum = originCondition.pageNum;
    loadAllArticle();
  });
});

const updateArticleShowCommentStatus = (value: boolean, article: Article) => {
  article.showComment = value;
  // 更新数据
  updateArticle(article).then(data => {
    if (data.success) {
      // 修改成功
      window.$message?.success(`已为该篇文章 ${value ? '开启' : '关闭'}评论`);
    }
  });
};

const updateArticlePublishStatus = (value: boolean, article: Article) => {
  article.publish = value;
  // 更新数据
  updateArticle(article).then(data => {
    if (data.success) {
      // 修改成功
      window.$message?.success(`已修改该篇文章的状态为 ${value ? '发布' : '下架'}`);
    }
  });
};

const recoverArticle = (article: Article) => {
  // 恢复文章
  if (!article.delete) {
    window.$message?.error('必须要先删除该篇文章');
    return;
  }
  article.delete = false;
  updateArticle(article).then(data => {
    if (data.success) {
      window.$message?.success(`已恢复 ${article.title} 该篇文章`);
      loadAllArticle();
    }
  });
};

const createColumns = (): DataTableColumns<Article> => {
  return [
    {
      type: 'selection'
    },
    {
      title: '封面',
      key: 'coverPictureUrl',
      width: 100,
      render(row) {
        return h(NAvatar, {
          src: row.coverPictureUrl as string,
          round: false
        });
      }
    },
    {
      title: '标题',
      key: 'title',
      width: 250,
      render(row) {
        return h(
          NEllipsis,
          {
            lineClamp: 1
          },
          {
            default: () => row.title
          }
        );
      }
    },
    {
      title: '是否删除',
      key: 'delete',
      width: 90,
      render(row) {
        return h(
          NTag,
          {
            type: row.delete ? 'error' : 'primary'
          },
          {
            default: () => (row.delete ? '已删除' : '正常')
          }
        );
      }
    },
    {
      title: '点赞量',
      key: 'likeNumber',
      width: 90,
      render(row) {
        return h(
          NText,
          {
            type: 'primary'
          },
          {
            default: () => row.likeNumber
          }
        );
      }
    },
    {
      title: '原创',
      key: 'originalArticle',
      width: 90,
      render(row) {
        return h(
          NTag,
          {
            type: row.originalArticle ? 'primary' : 'info'
          },
          {
            default: () => (row.originalArticle ? '原创' : '转载')
          }
        );
      }
    },
    {
      title: '允许评论',
      key: 'showComment',
      width: 100,
      render(row) {
        return h(
          NSwitch,
          {
            defaultValue: row.showComment,
            onUpdateValue: (value: boolean) => updateArticleShowCommentStatus(value, row)
          },
          {}
        );
      }
    },
    {
      title: '发布状态',
      key: 'publish',
      width: 150,
      render(row) {
        return h(
          NSwitch,
          {
            defaultValue: row.publish,
            onUpdateValue: (value: boolean) => updateArticlePublishStatus(value, row)
          },
          {}
        );
      }
    },
    {
      title: '定时',
      key: 'timing',
      width: 150,
      render(row) {
        return h(
          NTag,
          {
            type: row.timing ? 'primary' : 'info'
          },
          {
            default: () => (row.timing ? '定时' : '无')
          }
        );
      }
    },
    {
      title: '分类',
      key: 'tagNames',
      width: 350,
      render(row) {
        const tags = (row.tagNames as string)
          .split(',')
          .filter((tag, index) => index < 5)
          .map(tagKey => {
            return h(
              NTag,
              {
                style: {
                  marginRight: '6px'
                },
                type: 'primary'
              },
              {
                default: () => tagKey
              }
            );
          });
        return tags;
      }
    },
    {
      title: '类别',
      key: 'categoryNames',
      width: 350,
      render(row) {
        const tags = (row.categoryNames as string)
          .split(',')
          .filter((tag, index) => index < 5)
          .map(tagKey => {
            return h(
              NTag,
              {
                style: {
                  marginRight: '6px'
                },
                type: 'primary'
              },
              {
                default: () => tagKey
              }
            );
          });
        return tags;
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
                onClick: () => handleDeleteArticleInfo(row as Article)
              },
              { default: () => (row.delete ? '永久删除' : '删除') }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                ghost: true,
                onClick: () => showArticleDetails(row as Article)
              },
              { default: () => '编辑' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                ghost: true,
                disabled: !row.delete,
                onClick: () => recoverArticle(row as Article)
              },
              { default: () => '恢复' }
            )
          )
        );
      }
    }
  ];
};

const columns = createColumns();
</script>
