<template>
  <view class="bg-gray-50 dark:bg-black min-h-screen pb-24 transition-colors duration-300">
    <!-- Header -->
    <view class="fixed top-0 inset-x-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md pt-12 pb-2 px-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
      <view class="w-8"></view>
      <text class="text-lg font-bold text-gray-900 dark:text-white tracking-wide">WALLPAPER</text>
      <view class="w-8 flex items-center justify-end">
        <view class="w-6 h-6 text-gray-900 dark:text-white">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
             <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
           </svg>
        </view>
      </view>
    </view>

    <!-- Main Content -->
    <scroll-view scroll-y class="h-screen pt-24" @scrolltolower="loadMore" :show-scrollbar="false">
      <view class="pb-32">
        <!-- Banner Swiper -->
        <swiper 
          class="h-48 mx-4 mb-6 rounded-2xl overflow-hidden shadow-lg shadow-gray-200 dark:shadow-none" 
          circular 
          autoplay 
          interval="5000"
          indicator-dots
          indicator-active-color="#ffffff"
          indicator-color="rgba(255,255,255,0.5)"
        >
          <swiper-item v-for="(banner, index) in banners" :key="index">
            <view class="w-full h-full relative">
              <image :src="banner.image" mode="aspectFill" class="w-full h-full" />
              <view class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <text class="text-white font-bold text-lg">{{ banner.title }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>

        <!-- Categories -->
        <view class="flex items-center justify-between px-6 mb-8 overflow-x-auto no-scrollbar">
          <view v-for="(cat, index) in categories" :key="index" class="flex flex-col items-center gap-2">
            <view 
              class="w-14 h-14 rounded-full flex items-center justify-center text-gray-700 dark:text-white border border-gray-100 dark:border-white/10 shadow-sm bg-white dark:bg-zinc-800"
            >
              <!-- Rank -->
              <svg v-if="cat.id === 'rank'" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              <!-- 4K -->
              <svg v-if="cat.id === '4k'" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <!-- Live -->
              <svg v-if="cat.id === 'live'" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              <!-- Avatar -->
              <svg v-if="cat.id === 'avatar'" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </view>
            <text class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ cat.name }}</text>
          </view>
        </view>

        <!-- Waterfall Title -->
        <view class="px-4 mb-4 flex items-center justify-between">
          <text class="text-lg font-bold text-gray-900 dark:text-white">Trending Now</text>
          <text class="text-xs text-gray-400 dark:text-gray-600">View All ></text>
        </view>

        <!-- Waterfall Feed -->
        <view class="px-4 gap-4 columns-2 space-y-4">
          <view 
            v-for="item in tasks" 
            :key="item.id"
            class="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 relative group active:scale-95 transition-all duration-200"
            @tap="previewImage(item.resultUrl)"
          >
            <!-- Image -->
            <view class="w-full relative">
               <!-- Aspect Ratio Hack: using styling to let image determine height naturally for waterfall -->
              <image 
                :src="item.resultUrl" 
                mode="widthFix" 
                class="w-full block bg-gray-100 dark:bg-gray-800"
              />
              <view class="absolute top-2 right-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1">
                 <text class="text-white text-[10px]">4K</text>
              </view>
            </view>
            
            <!-- Info -->
            <view class="p-3">
              <text class="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">{{ item.model || 'Untitled' }}</text>
              <view class="flex items-center justify-between">
                <view class="flex items-center gap-1">
                   <view class="w-4 h-4 rounded-full bg-gray-200 overflow-hidden">
                      <image src="/static/logo.png" mode="aspectFill" class="w-full h-full" />
                   </view>
                   <text class="text-[10px] text-gray-500">User</text>
                </view>
                <view class="flex items-center gap-1">
                  <text class="text-[10px] text-gray-400">❤️ 1.2k</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- Load More -->
         <view v-if="loading" class="py-8 flex justify-center">
            <text class="animate-spin text-gray-400">↻</text>
         </view>
      </view>
    </scroll-view>

    <!-- Floating Action Button -->
    <view 
      class="fixed bottom-24 right-4 z-40 w-14 h-14 bg-black dark:bg-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-all"
      @tap="navigateToCreate"
    >
      <text class="text-3xl text-white dark:text-black font-light mb-1">+</text>
    </view>

    <FloatingTabBar />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import FloatingTabBar from '../../components/FloatingTabBar.vue';
import { aiService } from '../../services/api';

const tasks = ref([]);
const loading = ref(true);

const banners = ref([
  { title: "Cyberpunk City", image: "https://picsum.photos/800/400?random=1" },
  { title: "Nature's Silence", image: "https://picsum.photos/800/400?random=2" },
  { title: "Abstract Dreams", image: "https://picsum.photos/800/400?random=3" }
]);

const categories = ref([
  { id: 'rank', name: 'Rank' },
  { id: '4k', name: '4K' },
  { id: 'live', name: 'Live' },
  { id: 'avatar', name: 'Avatar' }
]);

const fetchTasks = async () => {
  loading.value = true;
  try {
    // Mock user ID 1 for now
    const res = await aiService.getTasks(1); 
    tasks.value = (res || []).filter(t => t.status === 'COMPLETED').map(t => ({
      ...t,
      // Random mock data for UI
      resultUrl: t.resultUrl || `https://picsum.photos/400/${Math.floor(Math.random() * 300 + 500)}?random=${t.id}`,
      model: t.model || 'Mountain View',
    })).reverse();
    
    // Fallback if no tasks
    if (tasks.value.length === 0) {
       tasks.value = Array(10).fill(0).map((_, i) => ({
         id: i,
         resultUrl: `https://picsum.photos/400/${Math.floor(Math.random() * 300 + 400)}?random=${i}`,
         model: 'Wallpaper Item',
         prompt: 'A beautiful scenery'
       }));
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  // Mock pagination
  console.log("Loading more...");
};

const previewImage = (url) => {
  // Navigate to detail page instead of simple preview
  uni.navigateTo({
    url: '/pages/detail/detail' 
  });
};

const navigateToCreate = () => {
  uni.navigateTo({ url: '/pages/ai/creation' });
};

onShow(() => {
  fetchTasks();
});
</script>
