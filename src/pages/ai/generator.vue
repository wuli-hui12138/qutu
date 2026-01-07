<template>
  <view class="min-h-screen bg-[#0f0c29] text-white font-sans transition-all duration-300">
    <!-- Futuristic Background Gradient -->
    <view class="fixed inset-0 z-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-80 pointer-events-none"></view>
    
    <!-- Content Layer -->
    <view class="relative z-10 flex flex-col h-screen">
      
      <!-- Header -->
      <view class="pt-12 px-6 pb-4 flex items-center justify-between">
        <text class="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AI 创作</text>
        <view class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </view>
      </view>

      <scroll-view scroll-y class="flex-1 px-6 pb-32" :show-scrollbar="false">
        
        <!-- Prompt Input Area -->
        <view class="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 mb-8 shadow-xl shadow-purple-900/20">
          <textarea 
            v-model="prompt"
            placeholder="描述你梦想中的壁纸..." 
            placeholder-class="text-gray-400"
            class="w-full h-32 text-lg text-white leading-relaxed mb-4 p-0 bg-transparent selection:bg-purple-500/30"
            :maxlength="200"
          />
          <view class="flex justify-end">
            <text class="text-xs text-gray-500">{{ prompt.length }}/200</text>
          </view>
        </view>

        <!-- Generate Button -->
        <button 
          class="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30 active:scale-95 transition-all mb-10"
          @tap="generate"
          :disabled="isGenerating"
        >
          <view v-if="isGenerating" class="animate-spin mr-2 text-white">⟳</view>
          <text class="text-white font-bold text-lg tracking-wide">{{ isGenerating ? '生成中...' : '立即生成' }}</text>
        </button>

        <!-- Style Selector -->
        <view class="mb-8">
          <text class="text-sm font-bold text-gray-400 mb-4 block uppercase tracking-wider">选择风格</text>
          <scroll-view scroll-x class="w-full whitespace-nowrap -mx-6 px-6" :show-scrollbar="false">
             <view class="flex gap-4">
               <view 
                 v-for="style in styles" 
                 :key="style.name"
                 class="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all active:scale-90"
                 :class="selectedStyle === style.name ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-transparent opacity-70 grayscale hover:grayscale-0'"
                 @tap="selectedStyle = style.name"
               >
                 <image :src="style.preview" mode="aspectFill" class="w-full h-full" />
                 <view class="absolute inset-0 bg-black/40 flex items-center justify-center">
                   <text class="text-xs font-bold text-white text-center">{{ style.label }}</text>
                 </view>
               </view>
             </view>
          </scroll-view>
        </view>

        <!-- Gallery / Recent Results -->
        <view>
          <text class="text-sm font-bold text-gray-400 mb-4 block uppercase tracking-wider">生成结果</text>
          <view class="grid grid-cols-2 gap-4">
             <view v-if="isGenerating" class="aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                <text class="text-purple-400 text-2xl">✨</text>
             </view>
             <view 
               v-for="(img, idx) in results" 
               :key="idx" 
               class="aspect-[4/5] rounded-2xl overflow-hidden relative group border border-white/5 bg-white/5"
               @tap="preview(img)"
             >
               <image :src="img" mode="aspectFill" class="w-full h-full" />
               <view class="absolute top-2 right-2 bg-black/50 backdrop-blur rounded-full px-2 py-1">
                 <text class="text-[10px] uppercase font-bold text-white/80">4K</text>
               </view>
             </view>
          </view>
        </view>

      </scroll-view>

      <FloatingTabBar />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import FloatingTabBar from '../../components/FloatingTabBar.vue';

const prompt = ref('');
const isGenerating = ref(false);
const selectedStyle = ref('Cyberpunk');

const styles = [
  { name: 'Cyberpunk', label: '赛博朋克', preview: 'https://picsum.photos/100/100?random=101' },
  { name: 'Watercolor', label: '水彩画', preview: 'https://picsum.photos/100/100?random=102' },
  { name: '3D Render', label: '3D渲染', preview: 'https://picsum.photos/100/100?random=103' },
  { name: 'Anime', label: '二次元', preview: 'https://picsum.photos/100/100?random=104' },
  { name: 'Oil Painting', label: '油画', preview: 'https://picsum.photos/100/100?random=105' },
];

const results = ref([
  'https://picsum.photos/400/500?random=200',
  'https://picsum.photos/400/500?random=201'
]);

const generate = () => {
  if (!prompt.value.trim()) return;
  isGenerating.value = true;
  setTimeout(() => {
    isGenerating.value = false;
    results.value.unshift(`https://picsum.photos/400/500?random=${Date.now()}`);
  }, 2000);
};

const preview = (url) => {
  uni.previewImage({ urls: [url] });
};
</script>
