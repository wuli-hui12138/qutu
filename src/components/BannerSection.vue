<template>
  <view 
    v-if="banners.length > 0"
    class="banner-section relative w-full aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl shadow-indigo-500/10 group active:scale-[0.98] transition-all duration-500"
    @tap="navigateToDetail(currentBanner.id)"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <image 
      :src="currentBanner.url" 
      mode="aspectFill"
      class="w-full h-full transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms]"
    />
    <view class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-7">
      <view class="flex items-center justify-between">
        <view class="flex flex-col">
          <view class="flex items-center gap-2 mb-1.5">
            <view class="w-1 h-3 bg-indigo-500 rounded-full"></view>
            <text class="text-white/80 text-[9px] font-black uppercase tracking-[0.2em]">Featured Release</text>
          </view>
          <text class="text-white font-extrabold text-lg tracking-tight leading-tight max-w-[240px]">
            {{ currentBanner.title || '探索无限创意边界' }}
          </text>
        </view>
      </view>
    </view>

    <!-- Pagination Dots -->
    <view v-if="banners.length > 1" class="absolute top-6 right-8 flex gap-2">
      <view 
        v-for="(_, idx) in banners" 
        :key="idx"
        :class="['h-1 rounded-full transition-all duration-500 bg-white', idx === currentIndex ? 'w-6 opacity-100' : 'w-1.5 opacity-30']"
      ></view>
    </view>
  </view>
  
  <view v-else class="w-full aspect-[21/9] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[32px] flex flex-col items-center justify-center border border-gray-100 overflow-hidden relative">
    <view class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></view>
    <text class="text-[10px] font-black text-indigo-300 tracking-[0.3em] uppercase">Curating Premium Pixels</text>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { wallpapersService } from '../services/api';

const banners = ref([]);
const currentIndex = ref(0);
const touchStart = ref(0);
const touchEnd = ref(0);
let timer = null;

const currentBanner = computed(() => banners.value[currentIndex.value] || {});

const fetchBanners = async () => {
  try {
    const data = await wallpapersService.findAll({ isBanner: true });
    banners.value = data || [];
  } catch (err) {
    console.error('Fetch banners failed', err);
  }
};

const startTimer = () => {
  if (banners.value.length <= 1) return;
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % banners.value.length;
  }, 5000);
};

const handleTouchStart = (e) => {
  touchStart.value = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
  touchEnd.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  if (!touchStart.value || !touchEnd.value) return;
  const distance = touchStart.value - touchEnd.value;
  if (distance > 50) {
    currentIndex.value = (currentIndex.value + 1) % banners.value.length;
  } else if (distance < -50) {
    currentIndex.value = (currentIndex.value - 1 + banners.value.length) % banners.value.length;
  }
  touchStart.value = 0;
  touchEnd.value = 0;
};

const navigateToDetail = (id) => {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` });
};

onMounted(() => {
  fetchBanners().then(startTimer);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
