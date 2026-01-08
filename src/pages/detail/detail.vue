<template>
  <view class="h-screen w-full bg-black relative flex flex-col overflow-hidden">
    <!-- Fullscreen Image Background -->
    <view class="absolute inset-0 z-0">
       <image 
         :src="currentImage" 
         mode="aspectFill" 
         class="w-full h-full opacity-100"
         @tap="toggleControls"
       />
       <!-- Overlay Gradient for text readability -->
       <view class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none"></view>
    </view>

    <!-- Header (Floating) -->
    <view 
      class="absolute top-0 inset-x-0 z-50 pt-12 pb-4 px-4 flex justify-between items-center transition-transform duration-300"
      :class="showControls ? 'translate-y-0' : '-translate-y-full'"
    >
      <view @tap="goBack" class="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95">
        <text class="text-xl">←</text>
      </view>
      
      <view class="flex gap-4">
        <!-- More Actions -->
        <view class="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95">
           <text class="text-xl">∙∙∙</text>
        </view>
      </view>
    </view>

    <!-- Bottom Glass Panel -->
    <view 
      class="absolute bottom-0 inset-x-0 z-50 pb-8 pt-6 px-5 transition-transform duration-300"
      :class="showControls ? 'translate-y-0' : 'translate-y-[150%]'"
    >
       <view class="glass rounded-[32px] p-5 border border-white/20 backdrop-blur-xl bg-black/40 text-white">
         
          <!-- Title & Tags -->
          <view class="mb-4">
            <text class="text-xl font-bold block mb-2">{{ title }}</text>
            <view class="flex flex-wrap gap-2">
              <view 
                v-for="(tag, index) in tags" 
                :key="index"
                class="px-3 py-1 rounded-full bg-white/20 text-xs font-medium"
              >
                #{{ tag.name }}
              </view>
            </view>
          </view>

         <!-- Actions Row -->
         <view class="flex items-center justify-between gap-4 mt-4">
           <!-- Preview -->
           <view class="flex flex-col items-center gap-1 active:scale-95 transition-transform" @tap="showToast('预览模式')">
             <text class="text-2xl">👁️</text>
             <text class="text-[10px] text-gray-300 uppercase">预览</text>
           </view>

           <!-- Download Button (Prominent) -->
           <view 
             class="flex-1 h-12 rounded-full bg-white text-black font-bold flex items-center justify-center shadow-lg active:scale-95 transition-transform"
             @tap="downloadImage"
           >
             下载原图
           </view>

           <!-- Favorite -->
           <view class="flex flex-col items-center gap-1 active:scale-95 transition-transform" @tap="toggleFavorite">
             <text class="text-2xl">{{ isFavorite ? '★' : '☆' }}</text>
             <text class="text-[10px] text-gray-300 uppercase">收藏</text>
           </view>

           <!-- Share -->
           <view class="flex flex-col items-center gap-1 active:scale-95 transition-transform" @tap="share">
             <text class="text-2xl">↗️</text>
             <text class="text-[10px] text-gray-300 uppercase">分享</text>
           </view>
         </view>

       </view>
    </view>

  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { wallpapersService } from '../../services/api';

const currentImage = ref('');
const showControls = ref(true);
const isFavorite = ref(false);
const title = ref('');
const tags = ref([]);
const wallpaper = ref(null);

onLoad((options) => {
  if (options.id) {
    fetchDetail(options.id);
  }
});

const fetchDetail = async (id) => {
  try {
    const data = await wallpapersService.findOne(id);
    if (data) {
      wallpaper.value = data;
      // Prefer original URL, fallback to thumb
      currentImage.value = data.url || data.thumb; 
      title.value = data.title;
      tags.value = data.tags || [];
    }
  } catch (err) {
    console.error(err);
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
};

const goBack = () => uni.navigateBack();

const toggleControls = () => {
  showControls.value = !showControls.value;
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  uni.showToast({ title: isFavorite.value ? '已收藏' : '取消收藏', icon: 'none' });
};

const downloadImage = () => {
  if (!currentImage.value) return;
  
  uni.showLoading({ title: '下载中...' });
  
  // Backend proxy handles /uploads path
  const url = currentImage.value.startsWith('http') ? currentImage.value : currentImage.value;
  
  uni.downloadFile({
    url: url,
    success: (res) => {
      if (res.statusCode === 200) {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            uni.hideLoading();
            uni.showToast({ title: '已保存到相册', icon: 'success' });
          },
          fail: (err) => {
            uni.hideLoading();
            console.error(err);
            uni.showToast({ title: '保存失败', icon: 'none' });
          }
        });
      } else {
        uni.hideLoading();
        uni.showToast({ title: '下载失败', icon: 'none' });
      }
    },
    fail: (err) => {
      uni.hideLoading();
      console.error(err);
      uni.showToast({ title: '网络错误', icon: 'none' });
    }
  });
};

const showToast = (msg) => uni.showToast({ title: msg, icon: 'none' });
const share = () => showToast('分享菜单已打开');
</script>

<style scoped>
.glass {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
</style>
