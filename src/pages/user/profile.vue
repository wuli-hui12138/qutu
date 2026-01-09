<template>
  <view class="bg-white dark:bg-black min-h-screen pb-24 transition-colors duration-300">
    <!-- Header -->
    <view class="pt-12 px-6 pb-4 bg-white dark:bg-black sticky top-0 z-40 flex items-center justify-between">
      <view class="w-8"></view>
      <text class="text-base font-bold text-gray-900 dark:text-white">个人中心</text>
      <view class="relative">
        <text class="text-2xl text-gray-900 dark:text-white">🔔</text>
        <view class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></view>
      </view>
    </view>
  <view class="bg-gray-50 dark:bg-black min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
    <!-- Clean Header -->
    <view class="pt-12 px-6 pb-6 bg-white dark:bg-black border-b border-gray-100 dark:border-white/5">
       <view class="flex items-center gap-4">
         <view class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            <image src="/static/logo.png" mode="aspectFill" class="w-full h-full" />
         </view>
         <view>
            <text class="text-xl font-bold block">{{ userInfo.nickname || '未登录用户' }}</text>
            <text class="text-xs text-gray-500 mt-1">ID: {{ userInfo.openid || 'Guest' }}</text>
         </view>
       </view>
    </view>

    <!-- Content Tabs -->
    <view class="flex items-center justify-around border-b border-gray-200 dark:border-white/5 bg-white dark:bg-black sticky top-0 z-10">
       <view 
         v-for="tab in tabs" 
         :key="tab.key"
         class="py-3 px-4 text-sm font-medium relative"
         :class="activeTab === tab.key ? 'text-black dark:text-white' : 'text-gray-400'"
         @tap="activeTab = tab.key; loadTabData()"
       >
         {{ tab.name }}
         <view v-if="activeTab === tab.key" class="absolute bottom-0 inset-x-4 h-0.5 bg-black dark:bg-white rounded-full"></view>
       </view>
    </view>

    <!-- Tab Content -->
    <scroll-view scroll-y class="flex-1 p-4" style="height: calc(100vh - 200px);">
       
       <!-- Empty State -->
       <view v-if="currentList.length === 0" class="flex flex-col items-center justify-center py-20 opacity-50">
          <text class="text-3xl mb-2">📁</text>
          <text class="text-sm">暂无记录</text>
       </view>

       <!-- Grid List -->
       <view v-else class="grid grid-cols-3 gap-2">
          <view 
            v-for="item in currentList"
            :key="item.id"
            class="aspect-square bg-gray-200 rounded-lg overflow-hidden relative"
            @tap="goToDetail(item.id)"
          >
           <text class="text-sm font-bold text-gray-900 dark:text-white mb-4 block">创作者工具</text>
           <view class="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl overflow-hidden px-4 border border-gray-100 dark:border-white/5">
             <view 
               class="py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center active:bg-gray-100 dark:active:bg-zinc-800"
               @tap="navigateTo('/pages/admin/images')"
             >
               <view class="flex items-center gap-3">
                 <view class="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-black dark:text-white border border-gray-100 dark:border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                 </view>
                 <text class="text-sm font-medium text-gray-700 dark:text-gray-300">作品管理</text>
               </view>
               <view class="w-4 h-4 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></view>
             </view>
             <view 
               class="py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center active:bg-gray-100 dark:active:bg-zinc-800"
               @tap="navigateTo('/pages/admin/tags')"
             >
               <view class="flex items-center gap-3">
                 <view class="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-black dark:text-white border border-gray-100 dark:border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                 </view>
                 <text class="text-sm font-medium text-gray-700 dark:text-gray-300">分类/标签管理</text>
               </view>
               <view class="w-4 h-4 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></view>
             </view>
             <view 
               class="py-4 flex justify-between items-center active:bg-gray-100 dark:active:bg-zinc-800"
               @tap="navigateTo('/pages/admin/ai_config')"
             >
               <view class="flex items-center gap-3">
                 <view class="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-black dark:text-white border border-gray-100 dark:border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                 </view>
                 <text class="text-sm font-medium text-gray-700 dark:text-gray-300">AI 配置</text>
               </view>
               <view class="w-4 h-4 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></view>
             </view>
           </view>
        </view>

      </view>
    </scroll-view>

    <FloatingTabBar />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import FloatingTabBar from '../../components/FloatingTabBar.vue';

const userInfo = ref({ nickname: 'Alex', avatar: 'https://picsum.photos/seed/alex/200' });
const activeTab = ref('My Uploads');
const isCreator = ref(true); // Mock permission

const navigateToDetail = (id) => uni.navigateTo({ url: '/pages/detail/detail' });
const navigateTo = (url) => uni.navigateTo({ url });
</script>
