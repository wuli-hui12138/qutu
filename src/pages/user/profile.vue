<template>
  <view class="bg-white dark:bg-black min-h-screen pb-24 transition-colors duration-300">
    <!-- Header -->
    <view class="pt-12 px-6 pb-4 bg-white dark:bg-black sticky top-0 z-40 flex items-center justify-between">
      <view class="w-8"></view>
      <text class="text-base font-bold text-gray-900 dark:text-white">User Profile / Me</text>
      <view class="relative">
        <text class="text-2xl text-gray-900 dark:text-white">🔔</text>
        <view class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></view>
      </view>
    </view>

    <scroll-view scroll-y class="h-screen" :show-scrollbar="false">
      <view class="pb-32">
        
        <!-- User Info -->
        <view class="px-6 flex items-center gap-5 mb-8">
           <view class="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-lg">
             <image :src="userInfo.avatar || 'https://picsum.photos/seed/user/200'" mode="aspectFill" class="w-full h-full" />
           </view>
           <view class="flex-1">
             <text class="text-2xl font-bold text-gray-900 dark:text-white block">{{ userInfo.nickname || 'Alex' }}</text>
             <view class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-2">
               <view class="w-3 h-3 text-black dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
               </view>
               <text class="text-xs font-medium text-gray-500 dark:text-gray-400">Creator</text>
             </view>
           </view>
        </view>

        <!-- Stats -->
        <view class="flex items-center justify-around px-6 mb-8">
          <view class="flex flex-col items-center">
             <text class="text-lg font-bold text-gray-900 dark:text-white">5.2k</text>
             <text class="text-xs text-gray-500">Followers</text>
          </view>
          <view class="flex flex-col items-center">
             <text class="text-lg font-bold text-gray-900 dark:text-white">12k</text>
             <text class="text-xs text-gray-500">Likes</text>
          </view>
          <view class="flex flex-col items-center">
             <text class="text-lg font-bold text-gray-900 dark:text-white">45k</text>
             <text class="text-xs text-gray-500">Downloads</text>
          </view>
        </view>

        <!-- VIP Banner -->
        <view class="px-6 mb-8">
          <view class="w-full h-24 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-5 flex items-center justify-between shadow-xl shadow-orange-500/10 border border-orange-500/20 relative overflow-hidden group">
            <!-- Shine effect -->
            <view class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></view>
            
            <view class="z-10">
               <view class="flex items-center gap-2 mb-1">
                  <view class="w-5 h-5 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>
                  </view>
                  <text class="font-bold text-lg text-yellow-500">Upgrade to VIP</text>
               </view>
               <text class="text-xs text-gray-400">My Points: 1200</text>
            </view>
            <view class="w-5 h-5 text-gray-500">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </view>
          </view>
        </view>

        <!-- Tabs -->
        <view class="flex border-b border-gray-100 dark:border-white/5 px-6 mb-4 sticky top-16 bg-white dark:bg-black z-30">
          <view 
            v-for="tab in ['History', 'My Likes', 'My Uploads']" 
            :key="tab"
            class="mr-8 pb-3 relative text-sm font-bold transition-colors"
            :class="activeTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-400'"
            @tap="activeTab = tab"
          >
            {{ tab }}
            <view v-if="activeTab === tab" class="absolute bottom-0 inset-x-0 h-0.5 bg-gray-900 dark:bg-white rounded-full"></view>
          </view>
        </view>

        <!-- Content Grid (Mock) -->
        <view class="grid grid-cols-3 gap-1 px-4 mb-8">
           <view 
             v-for="i in 6" 
             :key="i" 
             class="aspect-[3/4] bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden"
             @tap="navigateToDetail(i)"
           >
             <image :src="`https://picsum.photos/300/400?random=${i + (activeTab === 'My Uploads' ? 100 : 0)}`" mode="aspectFill" class="w-full h-full" />
           </view>
        </view>
        
        <!-- Creator Tools -->
        <view v-if="isCreator" class="px-6 mb-8">
           <text class="text-sm font-bold text-gray-900 dark:text-white mb-4 block">Creator/Admin Tools</text>
           <view class="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl overflow-hidden px-4 border border-gray-100 dark:border-white/5">
             <view class="py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center active:bg-gray-100 dark:active:bg-zinc-800">
               <view class="flex items-center gap-3">
                 <view class="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-black dark:text-white border border-gray-100 dark:border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                 </view>
                 <text class="text-sm font-medium text-gray-700 dark:text-gray-300">Image Management</text>
               </view>
               <view class="w-4 h-4 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></view>
             </view>
             <view class="py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center active:bg-gray-100 dark:active:bg-zinc-800">
               <view class="flex items-center gap-3">
                 <view class="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-black dark:text-white border border-gray-100 dark:border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                 </view>
                 <text class="text-sm font-medium text-gray-700 dark:text-gray-300">Topic Config</text>
               </view>
               <view class="w-4 h-4 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></view>
             </view>
             <view class="py-4 flex justify-between items-center active:bg-gray-100 dark:active:bg-zinc-800">
               <view class="flex items-center gap-3">
                 <view class="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-black dark:text-white border border-gray-100 dark:border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                 </view>
                 <text class="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</text>
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
