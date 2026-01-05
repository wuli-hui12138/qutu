<template>
  <view class="bg-white min-h-screen pb-24">
    <!-- Header -->
    <view class="px-4 pt-10 pb-4 bg-transparent">
      <view class="flex items-center justify-between">
        <view class="flex items-center gap-2">
          <view class="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white text-[10px] font-black shadow-2xl shadow-black/30 transform hover:rotate-3 transition-transform">QT</view>
          <text class="font-black text-2xl tracking-tighter text-gray-900">趣图匣子</text>
        </view>
        <view class="flex items-center gap-3">
          <view
            @tap="navigateTo('/pages/ai/generator')"
            class="group w-11 h-11 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-all hover:bg-gray-50"
          >
            <text class="text-xl font-bold">+</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Banner Section -->
    <view class="px-4 mb-10 overflow-hidden">
      <BannerSection />
    </view>

    <!-- Gallery Section -->
    <view class="px-4">
      <view class="flex items-center justify-between mb-6 px-1">
        <view>
          <view class="flex items-center gap-2">
            <text class="font-black text-xl text-gray-900 tracking-tighter">热门精选</text>
            <view class="flex h-2 w-2 relative">
              <view class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></view>
              <view class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></view>
            </view>
          </view>
          <text class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Curated Hot Picking</text>
        </view>
        
        <view class="flex items-center gap-2">
          <view
            @tap="toggleLayout"
            class="px-3 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1.5"
          >
            <text>{{ layoutMode === 'waterfall' ? '瀑布流' : '大图' }}</text>
          </view>
          <view
            @tap="navigateTo('/pages/discover/discover')"
            class="px-3 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1"
          >
            <text>更多</text>
          </view>
        </view>
      </view>

      <view :class="[layoutMode === 'waterfall' ? 'columns-2 gap-3' : 'flex flex-col gap-6', 'pb-10']">
        <view v-for="item in wallpapers" :key="item.id" :class="[layoutMode === 'grid' ? 'w-full px-1' : 'break-inside-avoid mb-3']">
          <ImageCard
            :id="item.id"
            :src="item.thumb"
            :blurData="item.blurData"
            :title="item.title"
            :categories="item.categories"
            :tags="item.tags"
            :customClass="layoutMode === 'grid' ? 'aspect-[16/9]' : ''"
          />
        </view>
        
        <view v-if="wallpapers.length === 0" class="col-span-2 py-40 flex flex-col items-center justify-center gap-4 w-full">
          <view class="loading-spinner"></view>
          <text class="font-black tracking-[0.3em] uppercase text-[10px] text-gray-300">Loading Pixels</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BannerSection from '../../components/BannerSection.vue';
import ImageCard from '../../components/ImageCard.vue';
import { wallpapersService, categoriesService } from '../../services/api';

const wallpapers = ref([]);
const categories = ref([]);
const layoutMode = ref(uni.getStorageSync('qutu_layout_mode') || 'waterfall');

const toggleLayout = () => {
  layoutMode.value = layoutMode.value === 'waterfall' ? 'grid' : 'waterfall';
  uni.setStorageSync('qutu_layout_mode', layoutMode.value);
};

const fetchData = async () => {
  try {
    const [walls, cats] = await Promise.all([
      wallpapersService.findAll(),
      categoriesService.findAll()
    ]);
    wallpapers.value = walls || [];
    categories.value = cats || [];
  } catch (err) {
    console.error('Fetch data failed', err);
  }
};

const navigateTo = (url) => {
  uni.navigateTo({ url });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.columns-2 {
  column-count: 2;
}
.break-inside-avoid {
  break-inside: avoid;
}
</style>
