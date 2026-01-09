<template>
  <view class="bg-white dark:bg-black min-h-screen pb-24 transition-colors duration-300">
    <!-- Header: Search -->
    <view class="fixed top-0 inset-x-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md pt-12 pb-4 px-4 border-b border-gray-100 dark:border-white/5">
      <view class="h-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center px-4 gap-3">
        <text class="text-gray-400 text-lg">🔍</text>
        <input 
          class="flex-1 text-base text-gray-900 dark:text-white"
          placeholder="搜索壁纸..." 
          placeholder-class="text-gray-400"
        />
      </view>
    </view>

    <scroll-view scroll-y class="h-screen pt-32" :show-scrollbar="false">
      <view class="pb-32 px-4">
        
        <!-- Trending Searches -->
        <view class="mb-8">
          <text class="text-lg font-bold text-gray-900 dark:text-white mb-4 block">热门搜索</text>
          <view class="flex flex-wrap gap-2">
            <view 
              v-for="tag in trendingTags" 
              :key="tag" 
              class="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full active:scale-95 transition-transform"
            >
              <text class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ tag }}</text>
            </view>
          </view>
        </view>

        <!-- Categories Grid -->
        <view class="mb-8">
          <view class="grid grid-cols-2 gap-3">
            <!-- Large Item 1 -->
            <view class="col-span-1 aspect-square relative rounded-3xl overflow-hidden bg-blue-100">
              <image src="https://picsum.photos/400/400?random=10" mode="aspectFill" class="w-full h-full" />
              <view class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <text class="text-white font-bold text-lg">自然风光</text>
              </view>
            </view>
            <!-- Large Item 2 -->
            <view class="col-span-1 aspect-square relative rounded-3xl overflow-hidden bg-purple-100">
              <image src="https://picsum.photos/400/400?random=11" mode="aspectFill" class="w-full h-full" />
              <view class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <text class="text-white font-bold text-lg">抽象艺术</text>
              </view>
            </view>
            <!-- Wide Item -->
            <view class="col-span-2 aspect-[2/1] relative rounded-3xl overflow-hidden bg-red-100">
              <image src="https://picsum.photos/800/400?random=12" mode="aspectFill" class="w-full h-full" />
               <view class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <text class="text-white font-bold text-lg">豪车超跑</text>
              </view>
            </view>
            <!-- Small Item 3 -->
            <view class="col-span-1 aspect-square relative rounded-3xl overflow-hidden bg-pink-100">
              <image src="https://picsum.photos/400/400?random=13" mode="aspectFill" class="w-full h-full" />
               <view class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <text class="text-white font-bold text-lg">美女写真</text>
              </view>
            </view>
             <!-- Small Item 4 -->
            <view class="col-span-1 aspect-square relative rounded-3xl overflow-hidden bg-zinc-100">
              <image src="https://picsum.photos/400/400?random=14" mode="aspectFill" class="w-full h-full" />
               <view class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <text class="text-white font-bold text-lg">极简纹理</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Top Downloaded -->
        <view class="mb-4">
           <text class="text-lg font-bold text-gray-900 dark:text-white mb-4 block">本周热门榜单</text>
           <view class="space-y-4">
             <view v-for="(item, i) in topList" :key="i" class="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 rounded-2xl active:scale-98 transition-transform" @tap="goToDetail(item.id)">
               <text class="text-xl font-bold text-gray-300 italic w-6 text-center">{{ i + 1 }}</text>
               <image :src="item.image" mode="aspectFill" class="w-16 h-16 rounded-xl bg-gray-200 block shrink-0" />
               <view class="flex-1 min-w-0">
                 <text class="text-base font-bold text-gray-900 dark:text-white block truncate mb-1">{{ item.title }}</text>
                 <text class="text-xs text-gray-500 dark:text-gray-400 block">By {{ item.author }}</text>
               </view>
               <view class="flex flex-col items-end gap-1 text-orange-500 pr-2">
                   <text class="text-xs">🔥</text>
                   <text class="text-xs font-bold">{{ item.downloads }}</text>
               </view>
             </view>
           </view>
        </view>

      </view>
    </scroll-view>

    <FloatingTabBar />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FloatingTabBar from '../../components/FloatingTabBar.vue';
import { tagsService, wallpapersService } from '../../services/api';

const trendingTags = ref([]);
const topList = ref([]);
const categoryImages = ref([]); // To populate the grid

const fetchData = async () => {
  try {
    // 1. Fetch Tags
    const tags = await tagsService.findAll();
    trendingTags.value = tags.slice(0, 10).map(t => t.name);

    // 2. Fetch Wallpapers (Simulating "Top Download" by fetching all for now, as we don't have detailed download stats yet)
    // We can use the 'views' or 'likes' from seed data as a proxy for popularity
    const wallpapers = await wallpapersService.findAll();
    
    // Process for Top List
    topList.value = wallpapers
      .sort((a, b) => (b.likes || 0) - (a.likes || 0)) // Sort by likes for now
      .slice(0, 5)
      .map(w => ({
        id: w.id,
        title: w.title,
        author: w.author?.nickname || 'Qutu User',
        downloads: w.likes + ' Likes', // Using likes as proxy
        image: w.thumb || w.url
      }));

    // Process for Category Grid (Just taking random ones for visual variety in this grid for now)
    // In a real scenario, we might want to fetch by specific categories
    if (wallpapers.length > 0) {
        categoryImages.value = wallpapers.slice(0, 4);
    }

  } catch (error) {
    console.error("Discover data fetch failed", error);
  }
};

const goToDetail = (id) => {
    uni.navigateTo({ url: `/pages/detail/detail?id=${id}` });
}

onMounted(() => {
  fetchData();
});
</script>