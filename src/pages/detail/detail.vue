<template>
  <view v-if="loading" class="h-screen bg-black flex items-center justify-center text-white text-center">
    <view class="loading-spinner h-8 w-8 !border-white/20 !border-t-white"></view>
  </view>
  <view v-else-if="!image" class="h-screen bg-black flex items-center justify-center text-white font-bold tracking-widest uppercase">
    Pixel Lost
  </view>
  <view v-else class="min-h-screen w-full bg-black relative flex flex-col pb-10">
    <!-- Header -->
    <view class="w-full flex justify-between items-center px-6 py-4 bg-black border-b border-white/5">
      <view
        @tap="goBack"
        class="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition-all"
      >
        <text class="text-xl">←</text>
      </view>

      <view class="flex gap-2">
        <view
          @tap="onShare"
          class="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition-all"
        >
          <text>↑</text>
        </view>
        <view
          @tap="toggleLike"
          :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all border', isLiked ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white border-white text-gray-900']"
        >
          <text :class="isLiked ? 'text-white' : 'text-gray-900'">{{ isLiked ? '❤' : '♡' }}</text>
        </view>
      </view>
    </view>

    <!-- Main Image Container -->
    <view class="w-full min-h-[50vh] max-h-[75vh] flex items-center justify-center p-4 shrink-0 overflow-hidden relative">
      <image
        :src="image.url"
        mode="aspectFit"
        class="w-full max-h-full rounded-3xl"
      />
    </view>

    <!-- Previews -->
    <view class="flex gap-3 px-6 py-4">
      <view
        @tap="setPreview('mobile')"
        class="flex-1 bg-white/5 border border-white/10 text-white h-11 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
      >
        手机预览
      </view>
      <view
        @tap="setPreview('pc')"
        class="flex-1 bg-white/5 border border-white/10 text-white h-11 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
      >
        电脑预览
      </view>
      <view
        @tap="setPreview('avatar')"
        class="flex-1 bg-white/5 border border-white/10 text-white h-11 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
      >
        头像预览
      </view>
    </view>

    <!-- Info Panel -->
    <view class="px-6 pb-20 pt-4 flex-1">
      <view class="bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10 shadow-2xl">
        <view class="mb-8 space-y-4">
          <view class="space-y-3">
            <view class="flex items-start justify-between gap-4">
              <text class="text-white text-2xl font-black tracking-tight leading-tight flex-1">{{ image.title }}</text>
              <view class="flex flex-col items-end shrink-0 pt-1">
                <view class="text-[12px] font-black text-white flex items-center gap-1 mb-0.5">
                  <text class="text-red-500">❤</text>
                  {{ likeCount }}
                </view>
                <text class="text-[7px] font-black text-gray-500 uppercase tracking-widest">Fans LIKED</text>
              </view>
            </view>

            <!-- Author Section -->
            <view class="flex items-center gap-3 py-1">
              <view @tap="navigateToProfile" class="flex items-center gap-2 group">
                <view class="w-7 h-7 rounded-full overflow-hidden border border-white/10 ring-2 ring-white/5">
                  <image
                    :src="image.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'"
                    mode="aspectFill"
                    class="w-full h-full"
                  />
                </view>
                <view>
                  <text class="text-white text-[11px] font-black uppercase tracking-wide">{{ image.author?.nickname || "未名画师" }}</text>
                  <view class="text-[7px] text-gray-500 font-bold uppercase tracking-[0.1em] mt-0.5 flex items-center gap-1">
                    <view class="w-1 h-1 rounded-full bg-indigo-500"></view>
                    Verified Artist
                  </view>
                </view>
              </view>
              <view class="h-3 w-px bg-white/10 mx-1"></view>
              <text class="text-gray-500 text-[8px] font-bold uppercase tracking-widest">
                {{ formatTime(image.createdAt) }}
              </text>
            </view>
          </view>

          <!-- Tags -->
          <view class="flex flex-wrap gap-2">
            <view v-for="cat in image.categories" :key="cat.id" class="px-4 py-1.5 rounded-full bg-indigo-600/30 text-white text-[10px] font-black uppercase tracking-widest border border-indigo-400/20">
              {{ cat.name }}
            </view>
            <view v-for="tag in image.tags" :key="tag.id" class="px-4 py-1.5 rounded-full bg-white/5 text-white/60 text-[10px] font-bold uppercase tracking-widest border border-white/5">
              #{{ tag.name }}
            </view>
          </view>
        </view>

        <!-- Description & Sparkles -->
        <view v-if="image.description" class="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-6 min-h-[80px]">
          <view class="flex items-start gap-2 mb-3">
            <text class="text-gray-300 text-[11px] leading-relaxed font-medium">
              {{ image.description }}
            </text>
          </view>
          <view
            @tap="useAsPrompt"
            class="w-full py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
          >
            一键以此灵感绘图
          </view>
        </view>
      </view>

      <!-- Action Button -->
      <view class="px-6 py-8">
        <view
          @tap="handleDownload"
          class="w-full bg-white text-gray-900 h-16 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition shadow-2xl shadow-indigo-500/10 text-center"
        >
          保存高清原图
        </view>
      </view>

      <!-- Recommendations -->
      <view v-if="related.length > 0" class="px-6 py-10">
        <view class="flex items-center justify-between mb-6">
          <text class="text-white font-black text-[10px] uppercase tracking-[0.25em]">相关推荐</text>
          <view class="h-px flex-1 mx-4 bg-white/10"></view>
        </view>
        <view class="grid grid-cols-3 gap-3">
          <view 
            v-for="item in related" 
            :key="item.id" 
            @tap="navigateToDetail(item.id)"
            class="aspect-[3/4] rounded-xl overflow-hidden relative active:scale-95 transition"
          >
            <image :src="item.thumb" mode="aspectFill" class="w-full h-full" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { wallpapersService, interactionsService } from '../../services/api';
import { useUserStore } from '../../store/user';
import { storage } from '../../utils';

const userStore = useUserStore();
const id = ref(null);
const image = ref(null);
const related = ref([]);
const loading = ref(true);
const isLiked = ref(false);
const likeCount = ref(0);

onLoad((options) => {
  id.value = options.id;
});

const fetchData = async () => {
  if (!id.value) return;
  loading.value = true;
  try {
    // Ensure user is initialized before checking like state
    if (!userStore.id) await userStore.initUser();

    const data = await wallpapersService.findOne(id.value);
    image.value = data;
    likeCount.value = data.likes || 0;
    
    // Recommendations logic
    const tagNames = (data.tags || []).map(t => t.name).join(',');
    const catNames = (data.categories || []).map(c => c.name).join(',');
    
    const [tagRelated, catRelated] = await Promise.all([
      wallpapersService.findAll({ tags: tagNames, limit: 10 }),
      wallpapersService.findAll({ categories: catNames, limit: 10 })
    ]);
    
    const fromTags = (Array.isArray(tagRelated) ? tagRelated : []).filter(t => t.id != id.value).slice(0, 4);
    const fromCats = (Array.isArray(catRelated) ? catRelated : [])
      .filter(c => c.id != id.value && !fromTags.some(t => t.id == c.id))
      .slice(0, 2);
    
    related.value = [...fromTags, ...fromCats];
    
    // Like state from backend if possible, fallback to local for speed
    const likes = storage.get('qutu_likes') || [];
    isLiked.value = likes.includes(id.value);
    
    recordHistory(data);
  } catch (err) {
    console.error('Fetch detail failed', err);
  } finally {
    loading.value = false;
  }
};

const recordHistory = async (img) => {
  // Local cache for speed
  const history = storage.get('qutu_history') || [];
  const filtered = history.filter(item => item.id !== img.id);
  const newHistory = [{
    id: img.id,
    thumb: img.thumb,
    title: img.title,
    time: Date.now()
  }, ...filtered].slice(0, 50);
  storage.set('qutu_history', newHistory);

  // Sync to backend
  if (userStore.id) {
    try {
      await interactionsService.addHistory(userStore.id, img.id);
    } catch (err) {
      console.error('Sync history failed', err);
    }
  }
};

const toggleLike = async () => {
  if (!userStore.id) await userStore.initUser();
  const userId = userStore.id;
  const prevLiked = isLiked.value;
  isLiked.value = !prevLiked;
  likeCount.value += prevLiked ? -1 : 1;

  try {
    const data = await interactionsService.toggleFavorite(userId, id.value);
    isLiked.value = data.isLiked;
    likeCount.value = data.likes;
    
    let likes = storage.get('qutu_likes') || [];
    if (data.isLiked) {
      if (!likes.includes(id.value)) likes.push(id.value);
    } else {
      likes = likes.filter(itemId => itemId != id.value);
    }
    storage.set('qutu_likes', likes);
  } catch (err) {
    console.error('Toggle like failed', err);
    isLiked.value = prevLiked;
    likeCount.value += prevLiked ? 1 : -1;
  }
};

const handleDownload = () => {
  // In uni-app, downloadImage is usually used
  if (!image.value?.url) return;
  uni.setClipboardData({
    data: image.value.url,
    success: () => {
      uni.showToast({ title: '链接已复制，请在浏览器中打开下载', icon: 'none' });
    }
  });
};

const useAsPrompt = () => {
  uni.navigateTo({
    url: `/pages/ai/generator?prompt=${encodeURIComponent(image.value.description)}`
  });
};

const goBack = () => uni.navigateBack();
const navigateToDetail = (newId) => uni.redirectTo({ url: `/pages/detail/detail?id=${newId}` });
const navigateToProfile = () => uni.navigateTo({ url: `/pages/user/profile?id=${image.value.author?.id}` });
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
};

const setPreview = (type) => {
  uni.showToast({ title: `${type}预览功能开发中`, icon: 'none' });
};

const onShare = () => {
  uni.showToast({ title: '分享功能开发中', icon: 'none' });
};

onMounted(fetchData);
</script>

<style scoped>
/* Page specific styles */
</style>
