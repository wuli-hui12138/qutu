<template>
  <view class="min-h-screen bg-gray-50 dark:bg-black pb-10">
    <view class="p-4 space-y-6">
      
      <!-- Model Selection -->
      <view class="bg-white dark:bg-zinc-900 rounded-xl p-4">
        <text class="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">默认生成模型</text>
        <radio-group @change="handleModelChange" class="space-y-3">
          <label class="flex justify-between items-center p-3 border border-gray-100 dark:border-white/5 rounded-lg active:bg-gray-50 dark:active:bg-zinc-800">
             <view class="flex items-center gap-3">
               <view class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">🦄</view>
               <view>
                 <text class="block font-bold text-gray-900 dark:text-white">Stable Diffusion XL</text>
                 <text class="text-xs text-gray-400">目前画质最好的通用大模型</text>
               </view>
             </view>
             <radio value="sdxl" :checked="config.model === 'sdxl'" color="#000" />
          </label>
           <label class="flex justify-between items-center p-3 border border-gray-100 dark:border-white/5 rounded-lg active:bg-gray-50 dark:active:bg-zinc-800">
             <view class="flex items-center gap-3">
               <view class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🤖</view>
               <view>
                 <text class="block font-bold text-gray-900 dark:text-white">Midjourney V6</text>
                 <text class="text-xs text-gray-400">艺术感和创意性最佳</text>
               </view>
             </view>
             <radio value="mj" :checked="config.model === 'mj'" color="#000" />
          </label>
        </radio-group>
      </view>

      <!-- Parameters -->
      <view class="bg-white dark:bg-zinc-900 rounded-xl p-4">
        <text class="block text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">生图参数设置</text>
        
        <view class="mb-6">
          <view class="flex justify-between mb-2">
            <text class="text-sm font-medium text-gray-900 dark:text-white">迭代步数 (Steps)</text>
            <text class="text-sm font-bold text-blue-600">{{ config.steps }}</text>
          </view>
          <slider :value="config.steps" min="10" max="50" step="1" activeColor="#000000" @change="e => config.steps = e.detail.value" />
        </view>

         <view class="mb-6">
          <view class="flex justify-between mb-2">
            <text class="text-sm font-medium text-gray-900 dark:text-white">提示词相关性 (CFG Scale)</text>
            <text class="text-sm font-bold text-blue-600">{{ config.cfg }}</text>
          </view>
          <slider :value="config.cfg" min="1" max="20" step="0.5" activeColor="#000000" @change="e => config.cfg = e.detail.value" />
        </view>

        <view class="flex items-center justify-between">
           <text class="text-sm font-medium text-gray-900 dark:text-white">启用高清修复 (Hires. Fix)</text>
           <switch :checked="config.hires" color="#000" @change="e => config.hires = e.detail.value" />
        </view>
      </view>

      <!-- Advanced -->
       <view class="bg-white dark:bg-zinc-900 rounded-xl p-4">
        <text class="block text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">高级设置</text>
        <view>
           <text class="text-sm mb-2 block text-gray-900 dark:text-white">反向提示词 (Negative Prompt)</text>
           <textarea 
             v-model="config.negativePrompt" 
             class="w-full h-24 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg text-sm"
             placeholder="输入不希望出现的元素，例如：nsfw, low quality..."
             placeholder-class="text-gray-400"
            />
        </view>
      </view>

    </view>
    
    <!-- Save Button -->
    <view class="fixed bottom-0 inset-x-0 p-4 bg-white dark:bg-black border-t border-gray-100 dark:border-white/10">
      <button class="w-full h-12 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center shadow-lg active:scale-95" @tap="save">
        保存配置
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const config = ref({
  model: 'sdxl',
  steps: 30,
  cfg: 7.0,
  hires: false,
  negativePrompt: 'nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry'
});

const handleModelChange = (e) => {
  config.value.model = e.detail.value;
};

const save = () => {
  uni.showLoading({ title: '保存中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '配置已保存', icon: 'success' });
  }, 1000);
};
</script>
