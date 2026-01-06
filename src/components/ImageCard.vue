<template>
  <view class="image-card" @tap="navigateToDetail">
    <view class="card-content block rounded-[28px] overflow-hidden shadow-sm bg-white mb-4 active:scale-[0.98] transition-all group border border-gray-100">
      <view :class="['image-container relative overflow-hidden bg-gray-50', customClass]">
        <!-- LCP Blur Placeholder -->
        <image
          v-if="blurData"
          :src="blurData"
          mode="aspectFill"
          :class="['absolute inset-0 z-0 transition-opacity duration-1000', isLoaded ? 'opacity-0' : 'opacity-100']"
          style="filter: blur(20px); transform: scale(1.2);"
        />

        <image
          :src="src"
          mode="widthFix"
          @load="onImageLoad"
          :class="['relative z-10 w-full transition-all duration-500', isLoaded ? 'opacity-100' : 'opacity-0', 'group-hover:scale-110']"
          lazy-load
        />
        
        <view class="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></view>
      </view>

      <view class="p-4 bg-white/70 backdrop-blur-md text-left">
        <view class="text-[11px] font-black text-gray-900 truncate mb-1.5 px-0.5 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">
          {{ title || 'Untitled Artwork' }}
        </view>

        <view class="flex items-center gap-2 min-h-[16px] opacity-60">
          <view v-for="cat in (categories || []).slice(0, 1)" :key="cat.id" class="text-[8px] font-black text-indigo-600 tracking-tighter uppercase whitespace-nowrap">
            {{ cat.name }}
          </view>
          <view class="w-1 h-1 bg-gray-300 rounded-full"></view>
          <view v-for="tag in (tags || []).slice(0, 1)" :key="tag.id" class="text-[8px] font-bold text-gray-400 tracking-tighter lowercase whitespace-nowrap">
            #{{ tag.name }}
          </view>
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
  blurData: String,
  customClass: String
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
.image-container image {
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
