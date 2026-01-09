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
           <view class="flex flex-col items-center gap-1 active:scale-95 transition-transform" @tap="openPreview">
             <view class="w-6 h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
             </view>
             <text class="text-[10px] text-gray-300 uppercase">预览</text>
           </view>

           <!-- Download Button (Prominent) -->
           <view 
             class="flex-1 h-12 rounded-full bg-white text-black font-bold flex items-center justify-center shadow-lg active:scale-95 transition-transform"
             @tap="downloadImage"
           >
             下载原图
           </view>

           <!-- Like (Heart) -->
           <view class="flex flex-col items-center gap-1 active:scale-95 transition-transform" @tap="toggleLike">
             <view class="w-6 h-6 flex items-center justify-center" :class="isLiked ? 'text-red-500' : 'text-white'">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
             </view>
             <text class="text-[10px] text-gray-300 uppercase">喜欢</text>
           </view>
         </view>

       </view>
    </view>

    <!-- Preview Modal -->
    <view v-if="showPreviewModal" class="absolute inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center" @tap="showPreviewModal = false">
      <view class="flex gap-8 mb-8" @tap.stop>
          <view @tap="previewMode = 'mobile'" class="flex flex-col items-center gap-2 opacity-50 transition-opacity" :class="{'opacity-100': previewMode === 'mobile'}">
             <view class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><text class="text-2xl">📱</text></view>
             <text class="text-xs text-white">手机</text>
          </view>
          <view @tap="previewMode = 'desktop'" class="flex flex-col items-center gap-2 opacity-50 transition-opacity" :class="{'opacity-100': previewMode === 'desktop'}">
             <view class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><text class="text-2xl">💻</text></view>
             <text class="text-xs text-white">电脑</text>
          </view>
          <view @tap="previewMode = 'avatar'" class="flex flex-col items-center gap-2 opacity-50 transition-opacity" :class="{'opacity-100': previewMode === 'avatar'}">
             <view class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><text class="text-2xl">👤</text></view>
             <text class="text-xs text-white">头像</text>
          </view>
      </view>
      
      <!-- Preview Container -->
      <view class="relative w-full h-[60vh] flex items-center justify-center" @tap.stop>
          <!-- Phone Frame -->
          <view v-if="previewMode === 'mobile'" class="w-[30vh] h-[60vh] border-4 border-gray-800 rounded-[2rem] overflow-hidden bg-black relative">
             <image :src="currentImage" mode="aspectFill" class="w-full h-full" />
             <!-- Time Mock -->
             <view class="absolute top-4 left-0 right-0 text-center text-white text-xs font-bold">12:30</view>
          </view>

          <!-- Desktop Frame -->
          <view v-if="previewMode === 'desktop'" class="w-[80%] aspect-video border-4 border-gray-800 rounded-lg overflow-hidden bg-black relative">
              <image :src="currentImage" mode="aspectFill" class="w-full h-full" />
          </view>

          <!-- Avatar Frame -->
          <view v-if="previewMode === 'avatar'" class="w-40 h-40 rounded-full border-4 border-white overflow-hidden relative shadow-2xl">
              <image :src="currentImage" mode="aspectFill" class="w-full h-full" />
          </view>
      </view>
       <text class="mt-8 text-white/50 text-sm">点击任意处关闭</text>
   </view>
 </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { wallpapersService } from '../../services/api';

const currentImage = ref('');
const showControls = ref(true);
const isLiked = ref(false); // Changed from isFavorite
const title = ref('');
const tags = ref([]);
const wallpaper = ref(null);
const showPreviewModal = ref(false);
const previewMode = ref('mobile'); // mobile, desktop, avatar

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

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  uni.showToast({ title: isLiked.value ? '已喜欢' : '取消喜欢', icon: 'none' });
};

const downloadImage = () => {
  if (!currentImage.value) return;
  uni.showLoading({ title: '下载中...' });
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
            
            // Save to local download history
            try {
                const history = uni.getStorageSync('my_downloads') || [];
                // Avoid duplicates
                const exists = history.some(h => h.id === wallpaper.value.id);
                if (!exists) {
                    history.unshift({
                        id: wallpaper.value.id,
                        url: wallpaper.value.url,
                        thumb: wallpaper.value.thumb,
                        title: wallpaper.value.title,
                        downloadedAt: new Date().toISOString()
                    });
                    // Limit to 50
                    if (history.length > 50) history.pop();
                    uni.setStorageSync('my_downloads', history);
                }
            } catch (e) {
                console.error(e);
            }
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

const openPreview = () => {
  showPreviewModal.value = true;
};
</script>

<style scoped>
.glass {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
</style>
