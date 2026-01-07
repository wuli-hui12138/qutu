<template>
  <view class="fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 pb-safe">
    <view class="h-16 flex items-center justify-around px-2">
      <!-- Home -->
      <view class="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group" @tap="switchTab('/pages/index/index')">
        <view :class="['w-6 h-6 transition-colors', isCurrent('/pages/index/index') ? 'text-black dark:text-white' : 'text-gray-400']">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
             <polyline points="9 22 9 12 15 12 15 22"></polyline>
           </svg>
        </view>
        <text :class="['text-[10px] font-medium tracking-wide', isCurrent('/pages/index/index') ? 'text-black dark:text-white' : 'text-gray-400']">首页</text>
      </view>

      <!-- Discovery -->
      <view class="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group" @tap="switchTab('/pages/discover/discover')">
        <view :class="['w-6 h-6 transition-colors', isCurrent('/pages/discover/discover') ? 'text-black dark:text-white' : 'text-gray-400']">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="10"></circle>
             <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
           </svg>
        </view>
        <text :class="['text-[10px] font-medium tracking-wide', isCurrent('/pages/discover/discover') ? 'text-black dark:text-white' : 'text-gray-400']">发现</text>
      </view>

      <!-- AI -->
      <view class="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group" @tap="switchTab('/pages/ai/generator')">
        <view :class="['w-6 h-6 transition-colors', isCurrent('/pages/ai/generator') ? 'text-purple-600' : 'text-gray-400']">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
           </svg>
        </view>
        <text :class="['text-[10px] font-medium tracking-wide', isCurrent('/pages/ai/generator') ? 'text-purple-600' : 'text-gray-400']">AI绘画</text>
      </view>

      <!-- Topics -->
      <view class="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group" @tap="switchTab('/pages/topics/topics')">
        <view :class="['w-6 h-6 transition-colors', isCurrent('/pages/topics/topics') ? 'text-black dark:text-white' : 'text-gray-400']">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
             <rect x="9" y="9" width="6" height="6"></rect>
             <line x1="9" y1="1" x2="9" y2="4"></line>
             <line x1="15" y1="1" x2="15" y2="4"></line>
             <line x1="9" y1="20" x2="9" y2="23"></line>
             <line x1="15" y1="20" x2="15" y2="23"></line>
             <line x1="20" y1="9" x2="23" y2="9"></line>
             <line x1="20" y1="14" x2="23" y2="14"></line>
             <line x1="1" y1="9" x2="4" y2="9"></line>
             <line x1="1" y1="14" x2="4" y2="14"></line>
           </svg>
        </view>
        <text :class="['text-[10px] font-medium tracking-wide', isCurrent('/pages/topics/topics') ? 'text-black dark:text-white' : 'text-gray-400']">专题</text>
      </view>

      <!-- Me -->
      <view class="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group" @tap="switchTab('/pages/user/profile')">
        <view :class="['w-6 h-6 transition-colors', isCurrent('/pages/user/profile') ? 'text-black dark:text-white' : 'text-gray-400']">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
             <circle cx="12" cy="7" r="4"></circle>
           </svg>
        </view>
        <text :class="['text-[10px] font-medium tracking-wide', isCurrent('/pages/user/profile') ? 'text-black dark:text-white' : 'text-gray-400']">我的</text>
      </view>
    </view>
    <view class="h-safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const isCurrent = (path) => {
  const pages = getCurrentPages();
  if (pages.length === 0) return false;
  const current = `/${pages[pages.length - 1].route}`;
  return current === path;
};

const switchTab = (path) => {
  if (isCurrent(path)) return;
  uni.reLaunch({ url: path });
};

const handleAction = () => {
  // Navigate to creation page which we will build
  uni.navigateTo({ url: '/pages/ai/creation' });
};
</script>

<style scoped>
.pb-safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.h-safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
