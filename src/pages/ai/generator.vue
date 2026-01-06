<template>
  <view class="bg-white min-h-screen text-gray-900 font-sans flex flex-col overflow-hidden selection:bg-indigo-100 uppercase-buttons">
    <!-- Header -->
    <view class="flex-shrink-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
      <view @tap="goBack" class="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all text-gray-600">
        <text>←</text>
      </view>
      <view class="w-9 h-9"></view>
    </view>

    <scroll-view scroll-y class="flex-1 bg-gray-50/50 hide-scrollbar">
      <view class="max-w-4xl mx-auto px-6 py-8">
        <!-- Creation Area -->
        <view class="space-y-10">
          <view class="space-y-4">
            <text class="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">灵感提示词</text>
            <view class="relative group">
              <textarea
                v-model="prompt"
                placeholder="描述您脑海中的视觉奇观..."
                class="w-full h-32 bg-white border border-gray-100 rounded-[20px] p-6 text-[15px] font-medium placeholder:text-gray-300"
                auto-height
              />
              <view class="mt-4">
                <text 
                  @tap="showNegative = !showNegative"
                  :class="['text-[10px] font-bold uppercase tracking-widest transition-colors', showNegative ? 'text-red-500' : 'text-gray-400']"
                >
                  {{ showNegative ? '✕ 移除负向提示' : '+ 添加负向提示' }}
                </text>
              </view>
            </view>

            <view v-if="showNegative" class="mt-2 transition-all">
              <textarea
                v-model="negativePrompt"
                placeholder="不希望在画面中出现的内容（如：模糊、变形的手指...）"
                class="w-full h-20 bg-red-50 border border-red-100 rounded-[16px] p-4 text-[13px] font-medium placeholder:text-red-200 text-red-700 mt-2"
              />
            </view>
          </view>

          <!-- Composite Action Section -->
          <view class="space-y-8">
            <!-- Aspect Ratio Selection -->
            <view class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
              <text class="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">选择画幅比例</text>
              <view class="flex gap-3">
                <view
                  v-for="ar in aspectRatios"
                  :key="ar.label"
                  @tap="handleARChange(ar.label)"
                  :class="['flex-1 py-3.5 rounded-2xl border transition-all flex flex-row items-center justify-center gap-2', aspectRatio === ar.label ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:bg-white']"
                >
                  <view :class="['ar-icon border-2 border-current rounded-sm', ar.iconClass]"></view>
                  <text class="text-[10px] font-bold">{{ ar.label }}</text>
                </view>
              </view>
            </view>

            <!-- Integrated Model & Generate Bar -->
            <view class="flex flex-col sm:flex-row gap-4">
              <!-- Model Picker -->
              <view class="relative group w-full sm:w-60 h-[72px]">
                <view
                  @tap="showModelPicker = !showModelPicker"
                  class="h-full px-6 bg-white border border-gray-100 rounded-[28px] flex flex-col justify-center cursor-pointer hover:border-indigo-200 shadow-sm overflow-hidden"
                >
                  <view class="flex items-center gap-1.5 mb-0.5">
                    <view class="w-1.5 h-1.5 rounded-full bg-indigo-500"></view>
                    <text class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Architecture</text>
                  </view>
                  <view class="flex items-center justify-between">
                    <text class="text-[14px] font-black text-gray-800 truncate">{{ selectedModel }}</text>
                    <text :class="['transition-transform duration-300', showModelPicker ? 'rotate-180' : '']">▼</text>
                  </view>
                </view>

                <!-- Model List Dropdown -->
                <view
                  v-if="showModelPicker"
                  class="absolute bottom-full mb-4 left-0 w-full sm:w-72 bg-white border border-gray-100 rounded-[32px] py-3 z-[60] shadow-2xl"
                >
                  <view class="px-6 py-2 border-b border-gray-50 mb-2">
                    <text class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Available Models</text>
                  </view>
                  <scroll-view scroll-y class="max-h-60 px-2">
                    <view
                      v-for="m in models"
                      :key="m"
                      @tap="selectModel(m)"
                      :class="['w-full text-left px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all flex items-center justify-between', selectedModel === m ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600']"
                    >
                      <text>{{ m }}</text>
                      <view v-if="selectedModel === m" class="w-1.5 h-1.5 rounded-full bg-indigo-500"></view>
                    </view>
                  </scroll-view>
                </view>
              </view>

              <!-- Main Action: Generate -->
              <view
                @tap="handleGenerate"
                :class="['flex-1 h-[72px] rounded-[28px] flex items-center justify-center gap-4 transition-all active:scale-[0.97] shadow-2xl relative overflow-hidden', prompt.trim() && !isGenerating ? 'bg-indigo-600' : 'bg-gray-100']"
              >
                <text v-if="isGenerating" class="text-white text-sm animate-spin">⌛</text>
                <block v-else>
                  <text class="text-white text-xl">⚡</text>
                  <text class="text-white font-black uppercase text-[15px] tracking-[0.3em]">立即生成</text>
                </block>
              </view>
            </view>
          </view>
        </view>

        <!-- Pending Tasks -->
        <view v-if="activeTasksCount > 0" class="mt-8 space-y-4">
          <view class="flex items-center gap-2">
            <text class="text-indigo-500 animate-spin">↻</text>
            <text class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">正在进行的任务 ({{ activeTasksCount }})</text>
          </view>
          <scroll-view scroll-x class="flex gap-4 pb-2" style="white-space: nowrap;">
            <view v-for="task in activeTasks" :key="task.id" class="inline-block w-64 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mr-4">
              <view class="flex items-center gap-4">
                <view class="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <text class="animate-spin">↻</text>
                </view>
                <view class="flex-1 min-w-0">
                  <text class="text-[12px] font-medium text-gray-700 truncate block">"{{ task.prompt }}"</text>
                  <view class="w-full h-1 bg-gray-50 rounded-full mt-2 overflow-hidden">
                    <view class="h-full bg-indigo-500 animate-pulse w-1/2"></view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- Results Section -->
        <view class="bg-white border-t border-gray-100 mt-20 pt-10">
          <view class="flex items-center justify-between mb-10">
            <text class="text-[12px] font-bold uppercase tracking-widest text-gray-400">历史创作画廊</text>
            <view @tap="navigateToHistory" class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">查看全部 →</view>
          </view>

          <view class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <view v-for="task in completedTasks.slice(0, 6)" :key="task.id" class="group relative bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                <view @tap="navigateToTask(task.id)" class="relative overflow-hidden bg-gray-50">
                  <image 
                    :src="task.thumbUrl || task.resultUrl" 
                    mode="widthFix" 
                    class="w-full h-auto transition-transform duration-1000"
                  />
                  <view class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                    <text class="text-white text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">查看详情</text>
                    <text class="text-white/60 text-[9px] font-medium italic line-clamp-2">"{{ task.prompt }}"</text>
                  </view>
                </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- Submission Modal Placeholder -->
    <view v-if="showSubmitModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <view class="bg-white w-full max-w-lg rounded-[32px] overflow-hidden p-8">
        <text class="text-lg font-black block">发布创作</text>
        <text class="text-xs text-gray-400 block mb-6">开发中...</text>
        <button @tap="showSubmitModal = false">确定</button>
      </view>
    </view>
    <FloatingTabBar />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad, onShow, onHide } from '@dcloudio/uni-app';
import FloatingTabBar from '../../components/FloatingTabBar.vue';
import { aiService } from '../../services/api';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const prompt = ref('');
const negativePrompt = ref('');
const showNegative = ref(false);
const aspectRatio = ref('1:1');
const selectedModel = ref('Stable Diffusion XL');
const models = ref(['Stable Diffusion XL']);
const showModelPicker = ref(false);
const tasks = ref([]);
const isGenerating = ref(false);
const showSubmitModal = ref(false);

const aspectRatios = [
  { label: '1:1', iconClass: 'w-4 h-4' },
  { label: '9:16', iconClass: 'w-3 h-5' },
  { label: '16:9', iconClass: 'w-5 h-3' }
];

const activeTasks = computed(() => tasks.value.filter(t => t.status === 'PROCESSING'));
const activeTasksCount = computed(() => activeTasks.value.length);
const completedTasks = computed(() => tasks.value.filter(t => t.status === 'COMPLETED'));

onLoad((options) => {
  if (options.prompt) {
    prompt.value = decodeURIComponent(options.prompt);
  }
});

const fetchTasks = async () => {
  if (!userStore.id) return;
  try {
    const data = await aiService.getTasks(userStore.id);
    tasks.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Fetch tasks failed', err);
  }
};

const handleARChange = (ar) => {
  aspectRatio.value = ar;
};

const selectModel = (m) => {
  selectedModel.value = m;
  showModelPicker.value = false;
};

const handleGenerate = async () => {
  if (!prompt.value.trim() || isGenerating.value) return;
  
  if (activeTasksCount.value >= 4) {
    uni.showToast({ title: '当前生成任务已达上限 (4)', icon: 'none' });
    return;
  }

  isGenerating.value = true;
  try {
    await aiService.generate({
      prompt: prompt.value,
      negativePrompt: showNegative.value ? negativePrompt.value : '',
      model: selectedModel.value,
      userId: userStore.id,
      aspect_ratio: aspectRatio.value
    });
    prompt.value = '';
    await fetchTasks();
  } catch (err) {
    uni.showToast({ title: '生成失败，请重试', icon: 'none' });
  } finally {
    isGenerating.value = false;
  }
};

const goBack = () => uni.navigateBack();
const navigateToHistory = () => uni.navigateTo({ url: '/pages/ai/history' });
const navigateToTask = (id) => uni.navigateTo({ url: `/pages/ai/detail?id=${id}` });

let polling = null;

onShow(async () => {
  await userStore.initUser();
  fetchTasks();
  if (!polling) {
    polling = setInterval(fetchTasks, 5000);
  }
});

onHide(() => {
  if (polling) {
    clearInterval(polling);
    polling = null;
  }
});
</script>

<style scoped>
.ar-icon {
  display: inline-block;
  vertical-align: middle;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
