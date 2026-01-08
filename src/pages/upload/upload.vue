<template>
  <view class="bg-white dark:bg-black min-h-screen pb-24 transition-colors duration-300">
    <!-- Header -->
    <view class="pt-12 px-6 pb-4 flex items-center justify-between sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <view @tap="goBack" class="w-10 h-10 -ml-2 flex items-center justify-center active:scale-90 transition-all text-gray-900 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </view>
      <text class="text-lg font-bold text-gray-900 dark:text-white tracking-wide">发布壁纸</text>
      <view class="w-8"></view>
    </view>

    <scroll-view scroll-y class="h-screen" :show-scrollbar="false">
       <view class="px-6 pb-40">
         
         <!-- Upload Area -->
         <view class="mt-4 mb-10 group">
           <view 
             class="w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center transition-all active:scale-[0.98]"
             :class="{'border-gray-900 dark:border-white': imagePath}"
             @tap="chooseImage"
           >
             <image v-if="imagePath" :src="imagePath" mode="aspectFit" class="w-full h-full rounded-3xl" />
             <view v-else class="flex flex-col items-center gap-4 p-8 text-center">
                <view class="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-gray-400 dark:text-gray-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </view>
                <text class="text-sm font-bold text-gray-500 dark:text-gray-400">点击上传图片</text>
                <text class="text-xs text-gray-400 dark:text-gray-600">支持 JPG, PNG (最大 10MB)</text>
             </view>
           </view>
           <view v-if="imagePath" class="mt-4 flex justify-center">
             <text class="text-xs text-gray-400 underline" @tap.stop="imagePath = ''">移除图片</text>
           </view>
         </view>

         <!-- Form Fields -->
         <view class="space-y-8">
            <!-- Title -->
            <view>
              <text class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">标题</text>
              <input 
                type="text" 
                v-model="form.title"
                placeholder="给你的壁纸起个名字" 
                placeholder-class="text-gray-300 dark:text-gray-700"
                class="w-full py-3 border-b border-gray-200 dark:border-zinc-800 text-lg font-medium text-gray-900 dark:text-white focus:border-black dark:focus:border-white transition-colors bg-transparent"
              />
            </view>

             <!-- Category -->
            <view>
              <text class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">分类</text>
              <picker mode="selector" :range="categories" @change="handleCategoryChange">
                 <view class="w-full py-3 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                   <text :class="form.category ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-700'" class="text-lg font-medium">
                     {{ form.category || '选择分类' }}
                   </text>
                   <text class="text-gray-400">></text>
                 </view>
              </picker>
            </view>

             <!-- Tags -->
            <view>
              <text class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">标签</text>
              <view class="flex flex-wrap gap-2 mb-3">
                 <view 
                   v-for="tag in commonTags" 
                   :key="tag"
                   class="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer active:scale-95"
                   :class="form.tags.includes(tag) ? 'bg-black dark:bg-white text-white dark:text-black border-transparent' : 'bg-transparent border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400'"
                   @tap="toggleTag(tag)"
                 >
                   #{{ tag }}
                 </view>
              </view>
            </view>

            <!-- Description -->
             <view>
              <text class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">描述</text>
              <textarea 
                v-model="form.description"
                placeholder="介绍一下这个作品..." 
                placeholder-class="text-gray-300 dark:text-gray-700"
                class="w-full h-24 py-3 border-b border-gray-200 dark:border-zinc-800 text-base text-gray-900 dark:text-white focus:border-black dark:focus:border-white transition-colors bg-transparent leading-relaxed"
                :maxlength="200"
              />
            </view>
         </view>

       </view>
    </scroll-view>

    <!-- Bottom Actions -->
    <view class="fixed bottom-0 inset-x-0 p-6 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 z-50">
       <button 
         class="w-full h-14 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-lg flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
         :disabled="!isValid"
         @tap="submit"
       >
         <text v-if="submitting">发布中...</text>
         <text v-else>立即发布</text>
       </button>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { categoriesService } from '../../services/api';

const imagePath = ref('');
const submitting = ref(false);
const form = ref({
  title: '',
  tags: [],
  description: '',
  category: ''
});

const commonTags = ['Minimalist', 'Nature', 'Cyberpunk', 'Abstract', 'Anime', 'Dark', 'City'];
const categories = ref([]);

onMounted(async () => {
  try {
    const res = await categoriesService.findAll();
    categories.value = res.map(c => c.name);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
  
  // Check for edit mode
  const pages = getCurrentPages();
  const options = pages[pages.length - 1].options;
  if (options.id) {
    uni.setNavigationBarTitle({ title: '编辑壁纸' });
    try {
      const data = await wallpapersService.findOne(options.id);
      if (data) {
        form.value.title = data.title;
        form.value.description = data.description;
        form.value.category = data.categories?.[0]?.name;
        form.value.tags = data.tags?.map(t => t.name) || [];
        imagePath.value = data.url;
        // Store ID for update
        form.value.id = data.id;
      }
    } catch (err) {
      console.error(err);
    }
  }
});

const isValid = computed(() => {
  return imagePath.value && form.value.title.trim() && form.value.category;
});

const goBack = () => uni.navigateBack();

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      imagePath.value = res.tempFilePaths[0];
    }
  });
};

const toggleTag = (tag) => {
  if (form.value.tags.includes(tag)) {
    form.value.tags = form.value.tags.filter(t => t !== tag);
  } else {
    if (form.value.tags.length >= 5) return;
    form.value.tags.push(tag);
  }
};

const handleCategoryChange = (e) => {
  form.value.category = categories.value[e.detail.value];
};

const submit = () => {
  if (!isValid.value) return;
  submitting.value = true;
  
  if (form.value.id) {
     // Edit Mode
     // For simplicity using same endpoint or separate?
     // Since uploadFile doesn't support PATCH easily with file + data mixed comfortably in all proxy scenarios,
     // we might need a separate logic. But let's assume update logic.
     // To simplify, if user didn't change image, we just use API JSON update. 
     // If user changed image (blob/tmp path), we use upload.
     
     const isNewImage = imagePath.value.startsWith('blob:') || imagePath.value.startsWith('http://tmp') || imagePath.value.startsWith('wxfile');
     
     if (!isNewImage) {
        // Just update metadata
        uni.request({
            url: `/api/wallpapers/${form.value.id}`,
            method: 'PATCH',
            data: {
               title: form.value.title,
               description: form.value.description,
               categories: form.value.category,
               tags: form.value.tags.join(','),
               // Keep existing visibility status
               isVisible: true 
            },
            success: (res) => {
                uni.showToast({ title: '更新成功', icon: 'success' });
                setTimeout(() => uni.navigateBack(), 1500);
            },
            fail: () => uni.showToast({ title: '更新失败', icon: 'none' }),
            complete: () => submitting.value = false
        });
        return;
     }
  }

  uni.uploadFile({
    url: '/api/wallpapers', 
    filePath: imagePath.value,
    name: 'file',
    formData: {
      title: form.value.title,
      description: form.value.description,
      categories: form.value.category,
      tags: form.value.tags.join(',')
    },
    success: (uploadFileRes) => {
      if (uploadFileRes.statusCode === 201 || uploadFileRes.statusCode === 200) {
         uni.showToast({ title: form.value.id ? '更新成功' : '发布成功! 等待审核', icon: 'success' });
         setTimeout(() => {
            if (form.value.id) uni.navigateBack();
            else uni.switchTab({ url: '/pages/index/index' });
         }, 1500);
      } else {
        uni.showToast({ title: '发布失败', icon: 'none' });
      }
    },
    fail: (err) => {
      console.error(err);
      uni.showToast({ title: '网络错误', icon: 'none' });
    },
    complete: () => {
      submitting.value = false;
    }
  });
};
</script>