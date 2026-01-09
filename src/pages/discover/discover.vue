<template>
  <view class="bg-gray-50 dark:bg-black min-h-screen flex flex-col transition-colors duration-300">
    <!-- Header: Search -->
    <view class="bg-white dark:bg-black p-4 pt-12 sticky top-0 z-40 border-b border-gray-100 dark:border-white/5">
       <view class="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full px-4 h-10">
          <text class="text-gray-400 mr-2">🔍</text>
          <input 
             v-model="searchQuery"
             class="flex-1 text-sm text-gray-900 dark:text-white"
             placeholder="搜索壁纸..."
             placeholder-class="text-gray-400"
             confirm-type="search"
             @confirm="handleSearch"
          />
          <view v-if="searchQuery" @tap="clearSearch" class="w-5 h-5 flex items-center justify-center text-gray-400">
             <text class="text-xs">✕</text>
          </view>
       </view>
       
       <!-- Quick Filters (Tags & Categories) -->
       <scroll-view scroll-x class="mt-3 whitespace-nowrap -mx-4 px-4 w-screen" :show-scrollbar="false">
          <view class="flex gap-2">
             <view 
               class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
               :class="!activeFilter ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'"
               @tap="clearFilters"
             >
               全部
             </view>
             <view 
               v-for="tag in filterTags" 
               :key="tag"
               class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
               :class="activeFilter === tag ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'"
               @tap="applyFilter(tag)"
             >
               {{ tag }}
             </view>
          </view>
       </scroll-view>
    </view>

    <!-- Results (Waterfall) -->
    <scroll-view scroll-y class="flex-1 p-4" @scrolltolower="loadMore">
       <view v-if="loading && results.length === 0" class="flex items-center justify-center py-20">
          <text class="text-gray-400">加载中...</text>
       </view>
       
       <view v-else-if="results.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
          <text class="text-4xl">🌵</text>
          <text class="text-sm">暂无相关壁纸</text>
       </view>

       <view v-else class="columns-2 gap-3 space-y-3">
          <view 
             v-for="item in results" 
             :key="item.id"
             class="break-inside-avoid bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm relative active:opacity-90 transition-opacity"
             @tap="goToDetail(item.id)"
          >
             <image :src="item.thumb || item.url" mode="widthFix" class="w-full bg-gray-200 min-h-[100px]" lazy-load />
             <view class="p-2">
                <text class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{{ item.title }}</text>
                <view class="flex items-center justify-between mt-1">
                   <text class="text-[10px] text-gray-500">{{ item.category }}</text>
                   <!-- <text class="text-[10px] text-gray-400">❤️ {{ item.likes }}</text> -->
                </view>
             </view>
          </view>
       </view>
       <view class="h-10"></view>
    </scroll-view>

    <FloatingTabBar />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FloatingTabBar from '../../components/FloatingTabBar.vue';
import { tagsService, wallpapersService, categoriesService } from '../../services/api';

const searchQuery = ref('');
const activeFilter = ref('');
const filterTags = ref([]);
const results = ref([]);
const loading = ref(false);

const fetchData = async () => {
    loading.value = true;
    try {
        // Build query params
        const params = {};
        if (searchQuery.value) params.search = searchQuery.value;
        if (activeFilter.value) {
            // Simple heuristic to check if it's a category or tag, or just send both
            // Backend supports filtering by both. Let's assume users click tags/cats
            params.tags = activeFilter.value; 
            // Also try sending as category if no results? exact match?
            // For simplicity, passing as tag first.
        }
        
        const res = await wallpapersService.findAll(params);
        results.value = res;
    } catch (e) {
        console.error(e);
        uni.showToast({ title: '加载失败', icon: 'none' });
    } finally {
        loading.value = false;
    }
};

const fetchFilters = async () => {
    try {
        const [cats, tags] = await Promise.all([
            categoriesService.findAll(),
            tagsService.findAll()
        ]);
        // Combine them for quick filter chips
        filterTags.value = [
            ...cats.map(c => c.name),
            ...tags.map(t => t.name)
        ].slice(0, 15); // limit chips
    } catch (e) { console.error(e); }
};

const handleSearch = () => {
    fetchData();
};

const clearSearch = () => {
    searchQuery.value = '';
    fetchData();
};

const applyFilter = (tag) => {
    activeFilter.value = tag;
    fetchData();
};

const clearFilters = () => {
    activeFilter.value = '';
    fetchData();
};

const goToDetail = (id) => {
    uni.navigateTo({ url: `/pages/detail/detail?id=${id}` });
}

// Reuse logic?
const loadMore = () => {
    // TODO: Pagination
}

onMounted(() => {
    fetchFilters();
    fetchData();
});
</script>