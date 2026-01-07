<template>
  <view class="bg-main min-h-screen pb-32 transition-colors duration-300">
    <!-- Header -->
    <view class="pt-14 px-8 pb-4 bg-gradient-to-b from-primary/5 to-bg-main flex items-center gap-4">
      <view @tap="goBack" class="w-10 h-10 rounded-xl bg-card border border-glass flex items-center justify-center shadow-sm active:scale-90 transition-all">
        <text class="text-dim text-lg">←</text>
      </view>
      <view>
        <text class="block font-black text-2xl text-main tracking-tighter mb-1 transition-colors">AI 创作</text>
        <text class="block text-[10px] font-bold text-dim uppercase tracking-[0.2em] transition-colors">Text to Image</text>
      </view>
    </view>

    <!-- unified Prompt Architect Console -->
    <view class="px-6 animate-in">
      <view class="glass rounded-[32px] p-8 border-glass shadow-2xl shadow-primary/10 space-y-8 transition-all duration-300">
        <!-- Input Area -->
        <view class="space-y-4">
          <view class="flex items-center gap-2">
            <view class="w-1 h-3 bg-primary rounded-full"></view>
            <text class="text-[10px] font-black text-dim uppercase tracking-widest">创作指令 / PROMPT</text>
          </view>
          <textarea 
            v-model="prompt"
            class="w-full h-32 bg-card/50 rounded-2xl p-4 text-main text-sm font-medium border border-glass placeholder:text-dim/50 shadow-inner focus:border-primary/50 transition-colors"
            placeholder="描述你脑海中的画面，支持中文或英文..."
            placeholder-class="text-dim/50"
          />
        </view>

        <!-- Model Selection -->
        <view class="space-y-4">
          <view class="flex items-center gap-2">
            <view class="w-1 h-3 bg-emerald-500 rounded-full"></view>
            <text class="text-[10px] font-black text-dim uppercase tracking-widest">神经模型 / MODEL</text>
          </view>
          <scroll-view scroll-x class="whitespace-nowrap" show-scrollbar="false">
            <view class="flex gap-4 pr-6">
              <view 
                v-for="model in aiModels" 
                :key="model.id"
                @tap="selectedModel = model.name"
                :class="['px-6 py-3 rounded-[20px] transition-all border shrink-0', selectedModel === model.name ? 'bg-primary text-white font-black border-primary shadow-xl shadow-primary/20 rotate-1' : 'bg-card text-dim border-glass hover:border-primary/30']"
              >
                <text class="text-[11px] uppercase tracking-widest">{{ model.displayName }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- Generate Button -->
        <view 
          @tap="handleGenerate"
          :class="['w-full h-16 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95 btn-primary', loading ? 'opacity-50 grayscale' : '']"
        >
          <text class="text-white font-black tracking-[0.2em] uppercase text-sm">
            {{ loading ? '神经元计算中...' : '启动幻像生成' }}
          </text>
          <text v-if="!loading" class="text-white/40">⚡</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { aiService } from '../../services/api';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const prompt = ref('');
const selectedModel = ref('dall-e-3');
const aiModels = ref([]);
const loading = ref(false);

const fetchData = async () => {
  try {
    const models = await aiService.getModels();
    aiModels.value = (models || []).filter(m => m.type === 'IMAGE');
    if (aiModels.value.length > 0 && !selectedModel.value) {
      selectedModel.value = aiModels.value[0].name;
    }
  } catch (err) {
    console.error('Fetch AI data failed', err);
  }
};

const handleGenerate = async () => {
  if (!prompt.value || loading.value) return;
  
  loading.value = true;
  try {
    await aiService.generate({
      prompt: prompt.value,
      model: selectedModel.value,
      userId: userStore.id
    });
    uni.showToast({ title: '已启动计算任务' });
    prompt.value = '';
    uni.navigateBack(); // Go back to Hub or History
  } catch (err) {
    uni.showToast({ title: '任务启动失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const goBack = () => uni.navigateBack();

onShow(async () => {
  await userStore.initUser();
  fetchData();
});
</script>

<style scoped>
.animate-in {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
