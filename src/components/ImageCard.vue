<template>
  <view class="image-card animate-in" @tap="navigateToDetail">
    <view class="relative group overflow-hidden rounded-[24px] bg-card glass border border-glass active:scale-[0.98] transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none">
      <!-- Image Layer -->
      <view class="relative aspect-[3/4] overflow-hidden">
        <image
          v-if="blurData"
          :src="blurData"
          mode="aspectFill"
          :class="['absolute inset-0 z-0 transition-opacity duration-1000', isLoaded ? 'opacity-0' : 'opacity-100']"
          style="filter: blur(20px); transform: scale(1.2);"
        />
        <image
          :src="src"
          mode="aspectFill"
          @load="onImageLoad"
          :class="['relative z-10 w-full h-full transition-transform duration-700', isLoaded ? 'opacity-100' : 'opacity-0', 'group-hover:scale-110']"
          lazy-load
        />
        <!-- Gradient Overlay -->
        <view class="absolute inset-x-0 bottom-0 z-20 h-2/3 bg-gradient-to-t from-bg-card via-bg-card/50 to-transparent"></view>
      </view>

      <!-- Glass Content Info -->
      <view class="absolute inset-x-0 bottom-0 z-30 p-4 pt-10">
        <text class="block text-[11px] font-black text-main truncate tracking-tight uppercase mb-1 transition-colors">
          {{ title || 'Celestial Fragment' }}
        </text>
        <view class="flex items-center gap-2 overflow-hidden">
          <view v-for="cat in (categories || []).slice(0, 1)" :key="cat.id" class="px-2 py-0.5 rounded-md bg-primary/10 text-[7px] font-black text-primary uppercase tracking-widest border border-primary/20 backdrop-blur-sm">
            {{ cat.name }}
          </view>
        </view>
      </view>

      <!-- Hover Action -->
      <view class="absolute top-4 right-4 z-40 opacity-0 group-active:opacity-100 transition-opacity">
        <view class="w-8 h-8 rounded-full bg-card/80 backdrop-blur-xl border border-glass flex items-center justify-center text-[10px] text-primary shadow-sm">
          ❤
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  id: [Number, String],
  src: String,
  title: String,
  categories: Array,
  tags: Array,
  blurData: String
});

const isLoaded = ref(false);
const onImageLoad = () => {
  isLoaded.value = true;
};

const navigateToDetail = () => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${props.id}`
  });
};
</script>

<style scoped>
.image-card {
  break-inside: avoid;
}
</style>
