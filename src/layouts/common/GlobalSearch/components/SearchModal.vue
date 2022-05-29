<template>
  <n-modal
    v-model:show="show"
    :segmented="{ footer: 'soft' }"
    :closable="false"
    preset="card"
    footer-style="padding: 0; margin: 0"
    class="rounded-16px w-630px fixed left-0 right-0 top-50px"
    @after-leave="handleClose"
  >
    <n-card class="rounded-16px shadow-sm" size="small">
      <n-space vertical :size="25">
        <n-grid cols="4" item-responsive responsive="screen">
          <n-grid-item span="l:1">
            <n-tag checkable> Uid </n-tag>
          </n-grid-item>
          <n-grid-item span="l:3">
            <n-input
              ref="inputRef"
              v-model:value="condition.uid"
              round
              clearable
              placeholder="请输入Uid"
              @input="handleSearch"
            >
              <template #prefix>
                <icon-uil-search class="text-15px text-[#c2c2c2]" />
              </template>
            </n-input>
          </n-grid-item>
        </n-grid>

        <n-grid cols="4" item-responsive responsive="screen">
          <n-grid-item span="l:1">
            <n-tag checkable> 其他Uid </n-tag>
          </n-grid-item>
          <n-grid-item span="l:3">
            <n-input
              ref="inputRef"
              v-model:value="condition.otherUid"
              round
              clearable
              placeholder="请输入其他Uid"
              @input="handleSearch"
            >
              <template #prefix>
                <icon-uil-search class="text-15px text-[#c2c2c2]" />
              </template>
            </n-input>
          </n-grid-item>
        </n-grid>

        <n-grid cols="4" item-responsive responsive="screen">
          <n-grid-item span="l:1">
            <n-tag checkable> 关键词 </n-tag>
          </n-grid-item>
          <n-grid-item span="l:3">
            <n-input
              ref="inputRef"
              v-model:value="condition.keyword"
              round
              clearable
              placeholder="请输入关键词"
              @input="handleSearch"
            >
              <template #prefix>
                <icon-uil-search class="text-15px text-[#c2c2c2]" />
              </template>
            </n-input>
          </n-grid-item>
        </n-grid>

        <n-date-picker
          v-model:value="startAndEndTime"
          type="datetimerange"
          :shortcuts="rangeShortcuts"
          @update:show="handleDate"
        />
      </n-space>

      <n-divider />
      <n-space vertical :size="20">
        <n-grid x-gap="12" :cols="3">
          <n-gi>
            <n-grid x-gap="12" :cols="2">
              <n-gi>
                <n-tag checkable>删除</n-tag>
              </n-gi>
              <n-gi>
                <n-switch v-model:value="condition.delete" />
              </n-gi>
            </n-grid>
          </n-gi>

          <n-gi>
            <n-grid x-gap="12" :cols="2">
              <n-gi>
                <n-tag checkable>展示</n-tag>
              </n-gi>
              <n-gi>
                <n-switch v-model:value="condition.show" />
              </n-gi>
            </n-grid>
          </n-gi>

          <n-gi>
            <n-grid x-gap="12" :cols="2">
              <n-gi>
                <n-tag checkable>状态</n-tag>
              </n-gi>
              <n-gi>
                <n-switch v-model:value="condition.status" />
              </n-gi>
            </n-grid>
          </n-gi>
        </n-grid>
        <!--<n-divider />-->

        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button round type="primary" @click="handleConditionButtonClick"> 确定 </n-button>
            </div>
          </n-col>
        </n-row>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed, watch, nextTick, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useDebounceFn, onKeyStroke } from '@vueuse/core';
import { useRouteStore } from '@/store';
import { formatTime } from '@/utils';
import { Condition } from '@/theme';
import SearchResult from './SearchResult.vue';
import SearchFooter from './SearchFooter.vue';

interface Props {
  /** 弹窗显隐 */
  value: boolean;
}

interface Emits {
  (e: 'update:value', val: boolean): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const router = useRouter();
const routeStore = useRouteStore();

const keyword = ref('');
const activePath = ref('');
const resultOptions = shallowRef<AuthRoute.Route[]>([]);
const inputRef = ref<HTMLInputElement>();
const rangeShortcuts = ref({
  此刻: () => {
    const nowDate = new Date().getTime();
    return [nowDate - 1000 * 60 * 60 * 24, nowDate];
  },
  近五天: () => {
    const nowDate = new Date().getTime();
    return [nowDate - 1000 * 60 * 60 * 24 * 5, nowDate];
  }
});

const condition = ref(new Condition(false, true, true));

const startAndEndTime = ref();

const handleSearch = useDebounceFn(search, 300);

const show = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit('update:value', val);
  }
});

const handleDate = (showControl: boolean) => {
  if (!showControl) {
    condition.value.startTime = formatTime(startAndEndTime.value[0]);
    condition.value.endTime = formatTime(startAndEndTime.value[1]);
  }
};

const handleConditionButtonClick = () => {
  console.log(condition.value);
};

watch(show, async val => {
  if (val) {
    /** 自动聚焦 */
    await nextTick();
    inputRef.value?.focus();
  }
});

/** 查询 */
function search() {
  resultOptions.value = routeStore.searchMenus.filter(
    menu => keyword.value && menu.meta?.title.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase().trim())
  );
  if (resultOptions.value?.length > 0) {
    activePath.value = resultOptions.value[0].path;
  } else {
    activePath.value = '';
  }
}

function handleClose() {
  show.value = false;
  /** 延时处理防止用户看到某些操作 */
  setTimeout(() => {
    resultOptions.value = [];
    keyword.value = '';
  }, 200);
}

/** key up */
function handleUp() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(item => item.path === activePath.value);
  if (index === 0) {
    activePath.value = resultOptions.value[length - 1].path;
  } else {
    activePath.value = resultOptions.value[index - 1].path;
  }
}

/** key down */
function handleDown() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(item => item.path === activePath.value);
  if (index + 1 === length) {
    activePath.value = resultOptions.value[0].path;
  } else {
    activePath.value = resultOptions.value[index + 1].path;
  }
}

/** key enter */
function handleEnter() {
  const { length } = resultOptions.value;
  if (length === 0 || activePath.value === '') return;
  const routeItem = resultOptions.value.find(item => item.path === activePath.value);
  if (routeItem?.meta?.href) {
    window.open(activePath.value, '__blank');
  } else {
    router.push(activePath.value);
    handleClose();
  }
}

onKeyStroke('Escape', handleClose);
onKeyStroke('Enter', handleEnter);
onKeyStroke('ArrowUp', handleUp);
onKeyStroke('ArrowDown', handleDown);
</script>
<style lang="scss" scoped></style>
