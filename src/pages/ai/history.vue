<template>
  <view class="bg-main min-h-screen pb-24 selection:bg-primary transition-colors duration-300">
    <!-- Header -->
    <view class="pt-14 px-6 sticky top-0 z-40 flex items-center justify-between pb-6 border-b border-glass glass">
      <view class="flex items-center gap-5">
        <view
          @tap="goGenerator"
          class="w-10 h-10 bg-card/50 rounded-xl text-dim border border-glass flex items-center justify-center active:scale-95 transition-all shadow-sm hover:text-main"
        >
          <text>←</text>
        </view>
        <view>
          <text class="text-xl font-black text-main tracking-tight block transition-colors">创作历史</text>
          <text class="text-[10px] font-bold text-dim uppercase tracking-widest mt-0.5 block transition-colors">您的数字杰作库</text>
        </view>
      </view>
      <view class="flex items-center gap-2">
        <view
          @tap="toggleManageMode"
          :class="['px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2', isManageMode ? 'bg-main text-primary shadow-lg ring-2 ring-primary/20' : 'bg-card border border-glass text-dim shadow-sm']"
        >
          <text>{{ isManageMode ? '取消选择' : '批量管理' }}</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="p-4">
      <view v-if="loading" class="py-40 flex flex-col items-center justify-center gap-4">
        <view class="w-8 h-8 border-2 border-glass border-t-primary rounded-full animate-spin"></view>
        <text class="text-[10px] font-bold text-dim uppercase tracking-widest">检索数字画廊...</text>
      </view>
      <view v-else>
        <view class="columns-2 gap-4 pb-20">
          <view
            v-for="task in tasks"
            :key="task.id"
            @tap="handleItemClick(task.id)"
            :class="['group relative bg-card border rounded-[28px] overflow-hidden transition-all break-inside-avoid shadow-sm hover:shadow-lg dark:shadow-none', selectedIds.includes(task.id) ? 'border-primary ring-4 ring-primary/10' : 'border-glass']"
          >
            <view class="relative overflow-hidden bg-bg-main/50">
              <image
                :src="task.thumbUrl || task.resultUrl"
                mode="widthFix"
                class="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              />
              <!-- Selection Badge -->
              <view v-if="isManageMode" class="absolute top-4 left-4 z-50">
                <view :class="['w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all', selectedIds.includes(task.id) ? 'bg-primary border-white text-white shadow-lg' : 'bg-card/80 border-glass backdrop-blur-md shadow-sm']">
                  <text v-if="selectedIds.includes(task.id)" class="text-xs">✔</text>
                  <view v-else class="w-1.5 h-1.5 rounded-full bg-dim/20"></view>
                </view>
              </view>
            </view>
            <view class="p-4 bg-card flex items-center justify-between border-t border-glass">
              <text class="text-[10px] font-black text-dim uppercase tracking-widest truncate max-w-[60%]">{{ task.model }}</text>
              <text class="text-[10px] font-bold text-dim/60">{{ formatDate(task.createdAt) }}</text>
            </view>
          </view>
        </view>

        <view v-if="tasks.length === 0" class="py-40 flex flex-col items-center justify-center text-center opacity-40">
          <text class="text-4xl text-dim block mb-6">✧</text>
          <text class="text-[10px] font-black uppercase tracking-[0.5em] text-dim">历史创作尚空</text>
        </view>
      </view>
    </scroll-view>

    <!-- Batch Action Bar -->
    <view v-if="selectedIds.length > 0" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-sm animate-in">
      <view class="glass border border-glass rounded-[32px] p-2 flex items-center gap-2 shadow-2xl shadow-primary/30">
        <view class="flex-1 flex items-center gap-4 pl-6">
          <text class="text-main font-black text-lg">{{ selectedIds.length }}</text>
          <view class="flex flex-col">
            <text class="text-dim text-[8px] font-black uppercase tracking-widest">已选</text>
            <text class="text-main text-[10px] font-bold">精选杰作</text>
          </view>
        </view>
        <view @tap="selectAll" class="px-6 py-4 rounded-2xl text-[10px] font-black text-dim uppercase tracking-widest transition-colors hover:text-main">
          {{ selectedIds.length === tasks.length ? '取消' : '全选' }}
        </view>
        <view
          @tap="handleBatchDelete"
          :class="['px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all', isDeleting ? 'bg-bg-main text-dim' : 'bg-red-500 text-white shadow-xl shadow-red-500/20 active:scale-95']"
        >
          <text>{{ isDeleting ? '...' : '删除' }}</text>
        </view>
      </view>
    </view>
    <FloatingTabBar />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import FloatingTabBar from '../../components/FloatingTabBar.vue';
import { aiService } from '../../services/api';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const tasks = ref([]);
const loading = ref(true);
const isManageMode = ref(false);
const selectedIds = ref([]);
const isDeleting = ref(false);

const fetchTasks = async () => {
  if (!userStore.id) return;
  try {
    const data = await aiService.getTasks(userStore.id);
    tasks.value = (data || []).filter(t => t.status === 'COMPLETED');
  } catch (err) {
    console.error('Fetch history failed', err);
  } finally {
    loading.value = false;
  }
};

const handleItemClick = (id) => {
  if (isManageMode.value) toggleSelect(id);
  else uni.navigateTo({ url: `/pages/detail/detail?id=${id}` });
};

const toggleSelect = (id) => {
  if (selectedIds.value.includes(id)) selectedIds.value = selectedIds.value.filter(i => i !== id);
  else selectedIds.value.push(id);
};

const selectAll = () => {
  if (selectedIds.value.length === tasks.value.length) selectedIds.value = [];
  else selectedIds.value = tasks.value.map(t => t.id);
};

const toggleManageMode = () => {
  isManageMode.value = !isManageMode.value;
  if (!isManageMode.value) selectedIds.value = [];
};

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0 || isDeleting.value) return;
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedIds.value.length} 张创作吗？`,
    success: async (res) => {
      if (res.confirm) {
        isDeleting.value = true;
        try {
          await aiService.deleteTasks(selectedIds.value);
          tasks.value = tasks.value.filter(t => !selectedIds.value.includes(t.id));
          selectedIds.value = [];
          isManageMode.value = false;
        } catch (err) {
          uni.showToast({ title: '删除失败', icon: 'none' });
        } finally {
          isDeleting.value = false;
        }
      }
    }
  });
};

const goGenerator = () => uni.navigateBack();
const formatDate = (date) => new Date(date).toLocaleDateString();

onShow(async () => {
  await userStore.initUser();
  fetchTasks();
});
</script>

<style scoped>
.columns-2 {
  column-count: 2;
}
.break-inside-avoid {
  break-inside: avoid;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
