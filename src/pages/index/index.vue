<template>
  <view class="bg-gray-50 dark:bg-black min-h-screen pb-24 transition-colors duration-300">
    <!-- Header -->
    <view class="fixed top-0 inset-x-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md pt-8 pb-2 px-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
      <view class="w-8"></view>
      <text class="text-lg font-bold text-gray-900 dark:text-white tracking-wide">壁纸中心</text>
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
              <text class="text-xl font-bold">{{ cat.name[0] }}</text>
            </view>
            <text class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ cat.name }}</text>
          </view>
        </view>

        <!-- Waterfall Title -->
        <view class="px-4 mb-4 flex items-center justify-between">
          <text class="text-lg font-bold text-gray-900 dark:text-white">今日推荐</text>
          <text class="text-xs text-gray-400 dark:text-gray-600" @tap="uni.switchTab({ url: '/pages/discover/discover' })">查看更多 ></text>
        </view>

        <!-- Waterfall Feed -->
        <view class="px-4 gap-4 columns-2 space-y-4">
          <view 
            v-for="item in tasks" 
            :key="item.id"
            class="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 relative group active:scale-95 transition-all duration-200"
            @tap="previewImage(item)"
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
              <text class="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">{{ item.model }}</text>
              <view class="flex items-center justify-between">
                <view class="flex items-center gap-1">
                   <view class="w-4 h-4 rounded-full bg-gray-200 overflow-hidden">
                      <image src="/static/logo.png" mode="aspectFill" class="w-full h-full" />
                   </view>
                   <text class="text-[10px] text-gray-500">{{ item.authorName }}</text>
                </view>
                <view class="flex items-center gap-1">
                  <text class="text-[10px] text-gray-400">❤️ {{ item.likes }}</text>
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
import { wallpapersService, categoriesService } from '../../services/api';

const tasks = ref([]); // Keeping variable name mostly for simplicity, but it stores wallpapers now
const loading = ref(true);

const banners = ref([
  { title: "Cyberpunk City", image: "https://picsum.photos/800/400?random=1" },
  { title: "Nature's Silence", image: "https://picsum.photos/800/400?random=2" },
  { title: "Abstract Dreams", image: "https://picsum.photos/800/400?random=3" }
]);

const categories = ref([]);

const fetchCategories = async () => {
  try {
     const res = await categoriesService.findAll();
     // Take first 4 or specific mapped ones
     categories.value = res.slice(0, 5); 
  } catch (e) {
     console.error(e);
  }
};

const fetchWallpapers = async () => {
  loading.value = true;
  try {
    const res = await wallpapersService.findAll();
    tasks.value = res.map(t => ({
      ...t,
      // Use thumb if available, or fall back to url. 
      // Backend returns /uploads/... paths. 
      resultUrl: t.thumb || t.url, 
      model: t.title || 'Untitled',
      authorName: t.author?.nickname || 'User',
      likes: t.likes || 0
    }));
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  console.log("Loading more...");
};

const previewImage = (item) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${item.id}` 
  });
};

const navigateToCreate = () => {
  uni.navigateTo({ url: '/pages/upload/upload' });
};

onShow(() => {
  fetchCategories();
  fetchWallpapers();
});
</script>
