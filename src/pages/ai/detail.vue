<template>
  <view v-if="loading" class="h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
    <text class="animate-spin text-indigo-500 text-2xl">↻</text>
    <text class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Retrieving Neural Record</text>
  </view>
  <view v-else-if="!task" class="h-screen bg-black flex items-center justify-center text-white font-black tracking-[0.5em] uppercase text-center px-10">
    Record Not Found
  </view>
  <view v-else class="min-h-screen w-full bg-black relative flex flex-col pb-24 selection:bg-indigo-500">
    <!-- Header -->
    <view class="w-full flex justify-between items-center px-6 py-4 bg-black border-b border-white/5">
      <view
        @tap="goBack"
        class="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition"
      >
        <text>←</text>
      </view>
    </view>

    <!-- Main Image -->
    <view class="w-full flex-1 flex items-center justify-center p-6 min-h-[60vh] relative">
      <image
        :src="task.resultUrl"
        mode="aspectFit"
        class="max-w-full max-h-[80vh] rounded-[32px] shadow-2xl"
      />
    </view>

    <!-- Previews -->
    <view class="flex gap-3 px-6 py-2">
      <view @tap="setPreview('mobile')" class="flex-1 bg-white/5 border border-white/10 text-white h-12 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition">
        手机预览
      </view>
      <view @tap="setPreview('pc')" class="flex-1 bg-white/5 border border-white/10 text-white h-12 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition">
        电脑预览
      </view>
      <view @tap="setPreview('avatar')" class="flex-1 bg-white/5 border border-white/10 text-white h-12 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition">
        头像预览
      </view>
    </view>

    <!-- Info Panel -->
    <view class="px-6 space-y-4">
      <view class="bg-white/5 backdrop-blur-3xl rounded-[32px] p-8 border border-white/10 shadow-2xl">
        <view class="flex items-center justify-between mb-6">
          <view>
            <view class="flex items-center gap-2.5 mb-2">
              <text class="px-2.5 py-0.5 bg-indigo-500 rounded text-[8px] font-black text-white uppercase tracking-widest">
                {{ task.model }}
              </text>
              <text class="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                {{ formatDate(task.createdAt) }}
              </text>
            </view>
            <text class="text-white text-2xl font-black tracking-tight leading-tight block">AI 创作详情</text>
          </view>
        </view>

        <!-- Prompt Box -->
        <view class="bg-white/5 rounded-2xl p-5 border border-white/5 relative group">
          <view class="flex items-center gap-2 mb-2">
            <text class="text-indigo-400 text-xs">✨</text>
            <text class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Prompt Logic</text>
          </view>
          <text class="text-gray-200 text-xs leading-relaxed font-medium italic block">
            "{{ task.prompt }}"
          </text>
        </view>
      </view>

      <view class="flex gap-4">
        <view
          @tap="handleDownload"
          class="flex-1 bg-white text-gray-900 h-16 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition shadow-2xl shadow-indigo-500/10"
        >
          下载原图
        </view>
        <view
          @tap="openSubmit"
          class="flex-1 bg-indigo-600 text-white h-16 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition shadow-2xl shadow-indigo-500/20"
        >
          发布至画廊
        </view>
      </view>
      
      <view @tap="handleDelete" class="w-full py-4 text-center mt-4">
        <text class="text-red-500/50 text-[10px] font-bold uppercase tracking-widest">删除此项记录</text>
      </view>
    </view>

    <!-- Submit Modal -->
    <view v-if="showSubmitModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <view class="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl p-10 flex flex-col relative">
        <view @tap="showSubmitModal = false" class="absolute right-8 top-8 p-2 text-gray-300">
           ✕
        </view>

        <view class="mb-10 text-center">
          <text class="text-2xl font-black text-gray-900 tracking-tight block">发布作品审核</text>
          <text class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">Share Your Creation with the World</text>
        </view>

        <view class="space-y-8">
          <view class="space-y-2">
            <text class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">作品标题</text>
            <input
              v-model="formData.title"
              class="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold"
              placeholder="Enter artwork title..."
            />
          </view>

          <view class="space-y-2">
            <text class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">作品分类</text>
            <view class="flex flex-wrap gap-2">
              <view
                v-for="cat in categories"
                :key="cat.id"
                @tap="toggleCategory(cat.name)"
                :class="['px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', (formData.categories || '').split(',').includes(cat.name) ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400']"
              >
                {{ cat.name }}
              </view>
            </view>
          </view>

          <view class="pt-6 flex gap-4">
            <view @tap="showSubmitModal = false" class="px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-gray-50 text-gray-400">
              取消
            </view>
            <view
              @tap="submitForReview"
              :class="['flex-1 py-5 rounded-2xl text-[11px] font-black text-white text-center uppercase tracking-[0.2em] shadow-xl transition-all', submitLoading ? 'bg-gray-400 opacity-50' : 'bg-gray-900']"
            >
              {{ submitLoading ? '提交中...' : '确认发布' }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { aiService, categoriesService, tagsService } from '../../services/api';

const id = ref(null);
const task = ref(null);
const loading = ref(true);
const showSubmitModal = ref(false);
const submitLoading = ref(false);
const categories = ref([]);
const tags = ref([]);
const formData = ref({
  title: '',
  categories: '',
  tags: '',
  description: ''
});

onLoad((options) => {
  id.value = options.id;
});

const fetchTask = async () => {
  if (!id.value) return;
  loading.value = true;
  try {
    const data = await aiService.getTaskStatus(id.value);
    task.value = data;
    formData.value.title = `AI 创作 - ${new Date(data.createdAt).toLocaleDateString()}`;
    formData.value.description = data.prompt;
  } catch (err) {
    console.error('Fetch task failed', err);
  } finally {
    loading.value = false;
  }
};

const fetchMetadata = async () => {
  try {
    const [cats, tgs] = await Promise.all([
      categoriesService.findAll(),
      tagsService.findAll()
    ]);
    categories.value = cats || [];
    tags.value = tgs || [];
  } catch (err) {
    console.error('Fetch metadata failed', err);
  }
};

const handleDownload = () => {
  if (!task.value?.resultUrl) return;
  uni.setClipboardData({
    data: task.value.resultUrl,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'none' });
    }
  });
};

const handleDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这张创作吗？此操作无法撤销。',
    success: async (res) => {
      if (res.confirm) {
        try {
          await aiService.deleteTask(id.value);
          uni.navigateBack();
        } catch (err) {
          uni.showToast({ title: '删除失败', icon: 'none' });
        }
      }
    }
  });
};

const openSubmit = () => {
  showSubmitModal.value = true;
  fetchMetadata();
};

const toggleCategory = (name) => {
  const current = formData.value.categories ? formData.value.categories.split(',').filter(Boolean) : [];
  if (current.includes(name)) {
    formData.value.categories = current.filter(n => n !== name).join(',');
  } else {
    formData.value.categories = [...current, name].join(',');
  }
};

const submitForReview = async () => {
  if (!formData.value.categories) {
    uni.showToast({ title: '请选择分类', icon: 'none' });
    return;
  }
  submitLoading.value = true;
  try {
    await aiService.submitToGallery({
      taskId: id.value,
      ...formData.value
    });
    uni.showToast({ title: '提交成功' });
    showSubmitModal.value = false;
  } catch (err) {
    uni.showToast({ title: '提交失败', icon: 'none' });
  } finally {
    submitLoading.value = false;
  }
};

const goBack = () => uni.navigateBack();
const formatDate = (date) => new Date(date).toLocaleString();
const setPreview = (type) => uni.showToast({ title: `${type}预览开发中`, icon: 'none' });

onMounted(fetchTask);
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
