<template>
  <n-space :vertical="true" :size="16">
    <n-card title="用户管理" size="huge" class="h-full shadow-sm rounded-16px"> </n-card>
    <div id="v-waterfall" ref="aurora-picture-box" class="v-waterfall-content">
      <div
        v-for="(img, index) in waterfallList"
        :key="index"
        class="v-waterfall-item"
        :style="{ top: img.top + 'px', left: img.left + 'px', width: ImgWidth + 'px', height: img.height }"
      >
        <img :src="img.src" alt="" />
      </div>
    </div>
  </n-space>
</template>

<script>
export default {
  name: 'PicWaterfall',
  data() {
    return {
      waterfallList: [],
      imgArr: [
        '/images/79834784_p0_master1200.webp',
        '/images/96264216_p0_master1200.webp',
        '/images/wallhaven-0qxx95.jpg',
        '/images/wallhaven-8x3v1k.jpg',
        '/images/wallhaven-72o6ze.jpg',
        '/images/wallhaven-kwl9j1.png'
      ],
      ImgWidth: '',
      ImgCol: 5,
      ImgRight: 10,
      ImgBottom: 10,
      deviationHeight: [],
      imgList: [],
      screenWidth: 100
    };
  },
  watch: {
    screenWidth(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = val;
        this.timer = true;
        const that = this;
        setTimeout(function () {
          that.calculationWidth();
          that.timer = false;
        }, 400);
      }
    }
  },
  created() {
    for (let i = 0; i < this.imgArr.length; i++) {
      this.imgList.push(this.imgArr[i]);
    }
  },
  mounted() {
    this.screenWidth = this.$refs['aurora-picture-box'].clientWidth;
    this.calculationWidth();
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
  },
  methods: {
    // 计算每个图片的宽度
    calculationWidth() {
      this.ImgWidth = (this.screenWidth - this.ImgRight * this.ImgCol) / this.ImgCol;
      // 初始化偏移高度数组
      this.deviationHeight = new Array(this.ImgCol);
      for (let i = 0; i < this.deviationHeight.length; i++) {
        this.deviationHeight[i] = 0;
      }
      this.imgPreloading();
    },
    // 图片预加载
    imgPreloading() {
      this.waterfallList = [];
      for (let i = 0; i < this.imgList.length; i++) {
        const aImg = new Image();
        aImg.src = this.imgList[i];
        aImg.onload = aImg.onerror = () => {
          const imgData = {};
          // 按比例计算图片高度
          imgData.height = (this.ImgWidth / aImg.width) * aImg.height;
          imgData.src = this.imgList[i];
          this.waterfallList.push(imgData);
          this.rankImg(imgData);
        };
      }
    },
    // 瀑布流布局
    rankImg(imgData) {
      const { ImgWidth, ImgRight, ImgBottom, deviationHeight } = this;
      const minIndex = this.filterMin();
      imgData.top = deviationHeight[minIndex];
      imgData.left = minIndex * (ImgRight + ImgWidth);
      deviationHeight[minIndex] += imgData.height + ImgBottom;
    },
    // 找到最短的列并返回下标
    filterMin() {
      const min = Math.min.apply(null, this.deviationHeight);
      return this.deviationHeight.indexOf(min);
    }
  }
};
</script>

<style>
.v-waterfall-content {
  width: 100%;
  height: 100%;
  position: relative;
}
.v-waterfall-item {
  position: absolute;
}
.v-waterfall-item img {
  width: 100%;
  height: 100%;
}
</style>
