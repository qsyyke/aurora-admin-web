<template>
  <div>
    <n-card>
      <n-tabs type="line" animated @update:value="changeTab">
        <n-tab-pane name="echarts" tab="图表">
          <div :id="echartId" ref="echarts" style="height: calc(65vh)"></div>
        </n-tab-pane>
        <n-tab-pane name="manage" tab="管理">
          <tag-list />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { floor } from 'lodash-es';
import { rand } from '@vueuse/core';
import { $ref } from 'vue/macros';
import { useAuthStore } from '@/store';
import { fetchAllCategory, fetchAllTagByCondition, fetchArticleByCondition, fetchLinkByCondition } from '@/service';
import TagList from '@/views/article/tag/TagList/index.vue';
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
const loadAllTagData = () => {
  return new Promise((resolve, reject) => {
    obj.tagArr = new Array<Tag>();
    obj.graphCategories = new Array<GraphTag>();
    // 加载所有的类别
    obj.condition.pageSize = 1000000;
    fetchAllTagByCondition(obj.condition).then(data => {
      data.data.result.forEach((tag, index) => {
        obj.tagArr.push(tag);
        obj.graphCategories.push({ name: tag.uid as string, uid: tag.uid as string });

        // 将类别节点也封装成图节点
        obj.graphNodes.push({
          id: tag.uid as string,
          name: tag.title as string,
          symbolSize: calculateSymbolSizeByCreateTime(tag.createdTime as string),
          x: getRandomCoordinateX(),
          y: getRandomCoordinateY(),
          value: tag.title as string,
          category: tag.uid as string
        });
        if (index === data.data.result.length - 1) {
          resolve(1);
        }
      });
    });
  });
};

const loadAllArticleData = () => {
  return new Promise(resolve => {
    obj.articleArr = new Array<Article>();
    const condition = new Condition(null, null, null);
    condition.pageSize = 100000;
    condition.otherUid = auth.getAuthUserInfo.userUid;
    if (!condition.otherUid) {
      window.$message?.error('必须要登录才能获取到友情链接信息');
      return;
    }
    fetchArticleByCondition(condition).then(data => {
      data.data.result.forEach((article, index) => {
        obj.articleArr.push(article);
        if (index === data.data.result.length - 1) {
          resolve(1);
        }
      });
    });
  });
};

const packageArticleNode = () => {
  return new Promise(resolve => {
    // 文章
    obj.articleArr.forEach((article, articleIndex) => {
      // 因为每篇文章的类别会存在多个，使用,分割开的
      let split: Array<string> = article.categoryUids?.split(',');
      if (!split) {
        split = new Array<string>();
      }
      split.forEach((articleCategory, index) => {
        obj.graphNodes.push({
          id: article.uid as string,
          name: article.title as string,
          symbolSize: calculateSymbolSizeByCreateTime(article.createTime as string),
          x: getRandomCoordinateX(),
          y: getRandomCoordinateY(),
          value: article.title as string,
          category: articleCategory as string
        });

        if (articleIndex === obj.articleArr.length - 1 && index === split.length - 1) {
          resolve(1);
        }
      });
    });
  });
};

const rePackageGraph = () => {
  return new Promise(resolve => {
    // 加载所有数据
    Promise.all([loadAllTagData(), loadAllArticleData()]).then(value => {
      // 封装关系节点信息
      Promise.all([packageArticleNode()]).then(data => {
        // 修改节点的大小
        // 建立关系
        obj.graphCategories.forEach((graphCategory, categoryIndex) => {
          obj.graphNodes
            .filter(graphNode => graphCategory.uid === graphNode.id)
            .forEach((graphNode, index) => {
              obj.graphNodes
                .filter(node => graphCategory.uid === node.category)
                .forEach(node => {
                  graphNode.symbolSize = graphNode.symbolSize === undefined ? 10 : graphNode.symbolSize + 10;
                  obj.graphLinks.push({ source: graphCategory.uid, target: node.id });
                  if (categoryIndex === obj.graphCategories.length - 1) {
                    setTimeout(() => {
                      obj.graphNodes.forEach(node => {
                        node.label = {
                          show: true
                        };
                      });
                      resolve(1);
                    }, 1500);
                  }
                });
            });
        });
      });
    });
  });
};

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
