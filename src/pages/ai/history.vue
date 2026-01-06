<template>
  <view class="bg-gray-50 min-h-screen pb-24 font-sans selection:bg-indigo-100 uppercase-buttons">
    <!-- Header -->
    <view class="pt-14 px-6 bg-white sticky top-0 z-40 flex items-center justify-between pb-6 border-b border-gray-100/50 backdrop-blur-xl bg-white/80">
      <view class="flex items-center gap-5">
        <view
          @tap="goGenerator"
          class="p-2.5 bg-gray-50 rounded-2xl text-gray-400 border border-gray-100"
        >
          <text>←</text>
        </view>
        <view>
          <text class="text-xl font-black text-gray-900 tracking-tight block">创作历史</text>
          <text class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 block">Your Neural Masterpieces</text>
        </view>
      </view>
      <view class="flex items-center gap-2">
        <view
          @tap="toggleManageMode"
          :class="['px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2', isManageMode ? 'bg-black text-white shadow-lg' : 'bg-gray-50 border border-gray-100 text-gray-500']"
        >
          <text>{{ isManageMode ? '取消选择' : '批量管理' }}</text>
        </view>
        <view v-if="!isManageMode" class="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <text class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{{ tasks.length }} 作品</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="p-4 md:p-8">
      <view v-if="loading" class="py-40 flex flex-col items-center justify-center gap-4">
        <text class="animate-spin text-indigo-50 text-2xl">↻</text>
        <text class="text-xs font-bold text-gray-400 uppercase tracking-widest">正在检索您的数字画廊...</text>
      </view>
      <view v-else>
        <view class="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          <view
            v-for="task in tasks"
            :key="task.id"
            @tap="handleItemClick(task.id)"
            :class="['group relative bg-white border rounded-[28px] overflow-hidden transition-all break-inside-avoid shadow-sm', selectedIds.includes(task.id) ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-gray-100']"
          >
            <view class="relative overflow-hidden bg-gray-50">
              <image
                :src="task.thumbUrl || task.resultUrl"
                mode="widthFix"
                class="w-full h-auto"
              />
              <!-- Selection Badge -->
              <view v-if="isManageMode" class="absolute top-4 left-4 z-50">
                <view :class="['w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all', selectedIds.includes(task.id) ? 'bg-indigo-600 border-white text-white' : 'bg-black/20 border-white/60 backdrop-blur-md']">
                  <text v-if="selectedIds.includes(task.id)">√</text>
                  <view v-else class="w-1.5 h-1.5 rounded-full bg-white/40"></view>
                </view>
              </view>
            </view>
            <view class="p-4 bg-white flex items-center justify-between border-t border-gray-50">
              <view class="flex items-center gap-2 overflow-hidden">
                <text class="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate">{{ task.model }}</text>
              </view>
              <text class="text-[10px] font-bold text-gray-300">{{ formatDate(task.createdAt) }}</text>
            </view>
          </view>
        </view>

        <view v-if="tasks.length === 0" class="py-40 flex flex-col items-center justify-center text-center opacity-20">
          <text class="text-6xl text-gray-300 block mb-6">□</text>
          <text class="text-sm font-bold uppercase tracking-[0.5em] text-gray-400">历史创作尚空</text>
        </view>
      </view>
    </scroll-view>

    <!-- Batch Action Bar -->
    <view v-if="selectedIds.length > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-sm">
      <view class="bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[32px] p-2 flex items-center gap-2 shadow-2xl">
        <view class="flex-1 flex items-center gap-4 pl-6">
          <text class="text-white font-black text-lg">{{ selectedIds.length }}</text>
          <view class="flex flex-col">
            <text class="text-white/40 text-[9px] font-black uppercase tracking-widest">Selected</text>
            <text class="text-white text-[10px] font-bold">ITEMS READY</text>
          </view>
        </view>
        <view @tap="selectAll" class="px-6 py-4 rounded-2xl text-[10px] font-black text-white hover:bg-white/5 uppercase tracking-widest transition-colors">
          {{ selectedIds.length === tasks.length ? '取消' : '全选' }}
        </view>
        <view
          @tap="handleBatchDelete"
          :class="['px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all', isDeleting ? 'bg-gray-800 text-gray-500' : 'bg-red-500 text-white shadow-xl shadow-red-500/20 active:scale-95']"
        >
          <text v-if="isDeleting">...</text>
          <text v-else>删除</text>
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
  if (isManageMode.value) {
    toggleSelect(id);
  } else {
    uni.navigateTo({ url: `/pages/ai/detail?id=${id}` });
  }
};

const toggleSelect = (id) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id);
  } else {
    selectedIds.value.push(id);
  }
};

const selectAll = () => {
  if (selectedIds.value.length === tasks.value.length) {
    selectedIds.value = [];
  } else {
    selectedIds.value = tasks.value.map(t => t.id);
  }
};

const toggleManageMode = () => {
  isManageMode.value = !isManageMode.value;
  if (!isManageMode.value) selectedIds.value = [];
};

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0 || isDeleting.value) return;
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedIds.value.length} 张创作吗？此操作无法撤销。`,
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

onShow(() => {
  userStore.initUser();
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
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
