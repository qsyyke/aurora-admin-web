<template>
  <div>
    <n-card>
      <n-tabs type="line" animated @update:value="changeTab">
        <n-tab-pane name="echarts" tab="图表">
          <div :id="echartId" ref="echarts" style="height: calc(65vh)"></div>
        </n-tab-pane>
        <n-tab-pane name="manage" tab="管理">
          <category-list />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { rand } from '@vueuse/core';
import { useAuthStore } from '@/store';
import { fetchAllCategory, fetchAllTagByCondition, fetchArticleByCondition, fetchLinkByCondition } from '@/service';
import CategoryList from '@/views/article/category/CategoryList/index.vue';
import { Condition } from '@/theme';
import { Category } from '@/theme/article/category';
import { Link } from '@/theme/article/link';
import { Article } from '@/theme/article/article';
import { Tag } from '@/theme/article/tag';

const auth = useAuthStore();
let myChart;

interface GraphCategory {
  name?: string;
  uid?: string;
}

interface GraphLink {
  source?: string;
  target?: string;
}

interface GraphNode {
  id?: string;
  name?: string;
  symbolSize?: number;
  label?: {
    show?: boolean;
  };
  x?: number;
  y?: number;
  value?: string;
  category?: string;
}

const obj = reactive({
  graphCategories: new Array<GraphCategory>(),
  graphCategoryNodes: new Array<GraphNode>(),
  graphNodes: new Array<GraphNode>(),
  graphLinks: new Array<GraphLink>(),
  tagArr: new Array<Tag>(),
  articleArr: new Array<Article>(),
  condition: new Condition(false, null, null)
});

const echartId = ref(`main${new Date().getTime()}`);

const calculateSymbolSizeByCreateTime = (createTime: string) => {
  // 获取年份
  const year = createTime.split('-')[0];
  // 截取年份的最后两位数字，作为大小
  return parseInt(year.substring(2, year.length), 4);
};

const getRandomCoordinateX = () => {
  return rand(-400, 400);
};

const getRandomCoordinateY = () => {
  return rand(-400, 400);
};

// 加载数据
async function loadAllCategoryData() {
  obj.tagArr = new Array<Tag>();
  obj.graphCategories = new Array<GraphCategory>();
  obj.graphCategoryNodes = new Array<GraphNode>();

  // 加载所有的类别
  obj.condition.pageSize = 1000000;
  await fetchAllTagByCondition(obj.condition).then(data => {
    Promise.all(
      data.data.result.map(tag => {
        obj.tagArr.push(tag);
        obj.graphCategories.push({ name: tag.title as string, uid: tag.uid as string });

        // 将类别节点也封装成图节点
        obj.graphCategoryNodes.push({
          id: tag.title as string,
          name: tag.title as string,
          symbolSize: calculateSymbolSizeByCreateTime(tag.createdTime as string),
          x: getRandomCoordinateX(),
          y: getRandomCoordinateY(),
          value: tag.title as string,
          category: tag.title as string
        });

        return true;
      })
    );
  });
}

async function loadAllArticleData() {
  obj.articleArr = new Array<Article>();
  const condition = new Condition(null, null, null);
  condition.pageSize = 100000;
  condition.otherUid = auth.getAuthUserInfo.userUid;
  if (!condition.otherUid) {
    window.$message?.error('必须要登录才能获取到友情链接信息');
    return;
  }

  await fetchArticleByCondition(condition).then(data => {
    Promise.all(
      data.data.result.map(article => {
        obj.articleArr.push(article);
        return true;
      })
    );
  });
}

async function packageArticleNode() {
  // 文章
  await Promise.all(
    obj.articleArr.map(async article => {
      // 因为每篇文章的类别会存在多个，使用,分割开的
      let split: Array<string> = article.tagNames?.split(',');
      if (!split) {
        split = new Array<string>();
      }
      await Promise.all(
        split.map(articleCategory => {
          obj.graphNodes.push({
            id: (article.uid as string) + articleCategory,
            name: article.title as string,
            symbolSize: calculateSymbolSizeByCreateTime(article.createTime as string),
            x: getRandomCoordinateX(),
            y: getRandomCoordinateY(),
            value: article.title as string,
            category: articleCategory as string,
            label: {
              show: true
            }
          });
          return true;
        })
      );

      return true;
    })
  );
}

async function rePackageGraph() {
  await loadAllCategoryData();
  await loadAllArticleData();
  await packageArticleNode();

  await Promise.all(
    obj.graphCategoryNodes.map(graphCategoryNode => {
      obj.graphNodes.push(graphCategoryNode);
      return true;
    })
  );
  // 建立关系
  await Promise.all(
    obj.graphCategoryNodes.map(async graphCategoryNode => {
      await Promise.all(
        obj.graphNodes.map(graphNode => {
          if (graphCategoryNode.id === graphNode.category) {
            obj.graphLinks.push({ source: graphCategoryNode.id, target: graphNode.id });
            graphCategoryNode.symbolSize =
              graphCategoryNode.symbolSize === undefined ? 10 : graphCategoryNode.symbolSize + 10;
          }
          return true;
        })
      );
    })
  );
}

const setOption = () => {
  const option = {
    title: {
      text: '',
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right'
    },
    tooltip: {},
    legend: [
      {
        // selectedMode: 'single',
        data: obj.graphCategories.map(value => {
          return value.name as string;
        })
      }
    ],
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        name: 'Les Miserables',
        type: 'graph',
        layout: 'none',
        data: obj.graphNodes,
        links: obj.graphLinks,
        categories: obj.graphCategories,
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 10
          }
        }
      }
    ]
  };
  myChart.setOption(option);
};

onMounted(() => {
  type EChartsOption = echarts.EChartsOption;
  const chartDom = document.getElementById(echartId.value)!;
  myChart = echarts.init(chartDom, 'dark');
  let option: EChartsOption;
  myChart.showLoading();

  rePackageGraph().then(data => {
    myChart.hideLoading();
    setOption();
  });
  window.onresize = () => {
    myChart.resize();
  };
});

const changeTab = (value: string | number) => {
  if (value === 'echarts') {
    const time = setInterval(() => {
      if (document.getElementById(echartId.value)) {
        const chartDom = document.getElementById(echartId.value)!;
        myChart = echarts.init(chartDom, 'dark');
        setOption();
        clearInterval(time);
      }
    }, 20);
  }
};
</script>

<style scoped lang="less"></style>
