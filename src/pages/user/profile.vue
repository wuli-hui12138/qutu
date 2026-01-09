<template>
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
             <image :src="item.thumb || item.url" mode="aspectFill" class="w-full h-full" lazy-load />
          </view>
       </view>
    </scroll-view>

    <!-- Creator Tools Entry (Subtle) -->
    <view class="mt-4 px-4 pb-24">
       <view class="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4" @tap="showCreatorTools = !showCreatorTools">
          <view class="flex justify-between items-center">
             <text class="font-bold">创作者/管理员工具</text>
             <text class="text-gray-400">{{ showCreatorTools ? '▲' : '▼' }}</text>
          </view>
          
          <view v-if="showCreatorTools" class="mt-4 grid grid-cols-4 gap-4">
             <view class="flex flex-col items-center gap-2" @tap.stop="navigateTo('/pages/upload/upload')">
                <view class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">📤</view>
                <text class="text-[10px]">发布</text>
             </view>
             <view class="flex flex-col items-center gap-2" @tap.stop="navigateTo('/pages/admin/images')">
                 <view class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">🖼️</view>
                 <text class="text-[10px]">作品管理</text>
             </view>
             <view class="flex flex-col items-center gap-2" @tap.stop="navigateTo('/pages/admin/tags')">
                 <view class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">🏷️</view>
                 <text class="text-[10px]">标签管理</text>
             </view>
             <view class="flex flex-col items-center gap-2" @tap.stop="navigateTo('/pages/admin/ai_config')">
                 <view class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">⚙️</view>
                 <text class="text-[10px]">AI设置</text>
             </view>
          </view>
       </view>
    </view>

    <FloatingTabBar />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import FloatingTabBar from '../../components/FloatingTabBar.vue';
import { interactionsService } from '../../services/api';

const userInfo = ref({ nickname: 'Guest', openid: 'mock_user' }); // Mock for now
const activeTab = ref('likes');
const showCreatorTools = ref(false);

const tabs = [
    { key: 'likes', name: '我的喜欢' },
    { key: 'downloads', name: '我的下载' },
    { key: 'history', name: '浏览记录' }
];

const currentList = ref([]);

const loadTabData = async () => {
    currentList.value = [];
    try {
        if (activeTab.value === 'likes') {
            // Need to implement backend API for fetching favorites list
            // interactionsService.getFavorites(userId)
            // For now, mock fallback or empty
            const res = await interactionsService.getFavorites(1); // Mock User ID 1
            currentList.value = res.map(f => f.image);
        } else if (activeTab.value === 'downloads') {
            const list = uni.getStorageSync('my_downloads') || [];
            currentList.value = list;
        } else if (activeTab.value === 'history') {
             // Mock history or fetch
             // const res = await interactionsService.getHistory(1);
             // currentList.value = res.map(h => h.image);
             // Since history backend logic wasn't fully verified, using local helps for immediate feedback?
             // Let's rely on empty for now if no API ready
        }
    } catch (e) {
        console.error(e);
        // Fallback for demo
        if (activeTab.value === 'downloads') {
             currentList.value = uni.getStorageSync('my_downloads') || [];
        }
    }
};

const goToDetail = (id) => {
    uni.navigateTo({ url: `/pages/detail/detail?id=${id}` });
};

const navigateTo = (url) => uni.navigateTo({ url });

onShow(() => {
    loadTabData();
});
</script>
