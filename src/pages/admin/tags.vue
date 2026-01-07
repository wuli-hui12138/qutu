<template>
  <view class="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
    <!-- Tabs -->
    <view class="bg-white dark:bg-zinc-900 px-4 pt-2 border-b border-gray-200 dark:border-white/10">
      <view class="flex">
        <view 
          class="flex-1 text-center py-3 border-b-2 font-bold transition-colors"
          :class="activeTab === 'category' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400'"
          @tap="activeTab = 'category'"
        >
          分类管理
        </view>
        <view 
          class="flex-1 text-center py-3 border-b-2 font-bold transition-colors"
          :class="activeTab === 'tag' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400'"
          @tap="activeTab = 'tag'"
        >
          标签管理
        </view>
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="flex-1 p-4">
      
      <!-- Category List -->
      <view v-if="activeTab === 'category'" class="grid grid-cols-2 gap-3">
        <view 
          v-for="(cat, index) in categories" 
          :key="index"
          class="bg-white dark:bg-zinc-900 rounded-xl p-4 flex flex-col items-center justify-center relative group h-28 border border-transparent active:border-blue-500"
        >
          <text class="text-2xl mb-2">{{ cat.icon }}</text>
          <text class="font-bold text-gray-900 dark:text-white">{{ cat.name }}</text>
          <view class="absolute top-2 right-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-full" @tap="removeCategory(index)">
             <svg class="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </view>
        </view>
        
        <!-- Add Button -->
        <view class="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center h-28 active:bg-gray-100" @tap="showAddModal('category')">
          <text class="text-2xl text-gray-400">+</text>
          <text class="text-sm text-gray-500 mt-1">新建分类</text>
        </view>
      </view>

      <!-- Tag List -->
      <view v-if="activeTab === 'tag'" class="flex flex-wrap gap-3">
        <view 
          v-for="(tag, index) in tags" 
          :key="index"
          class="px-4 py-2 bg-white dark:bg-zinc-900 rounded-full border border-gray-100 dark:border-white/10 flex items-center gap-2"
        >
          <text class="text-sm text-gray-800 dark:text-gray-200">#{{ tag }}</text>
          <view @tap="removeTag(index)" class="w-4 h-4 flex items-center justify-center text-gray-400">×</view>
        </view>
         <!-- Add Button -->
        <view class="px-4 py-2 border border-dashed border-gray-400 rounded-full flex items-center gap-2 text-gray-500 active:bg-gray-100" @tap="showAddModal('tag')">
          <text class="text-sm">+ 新增标签</text>
        </view>
      </view>

    </scroll-view>

    <!-- Simple Input Modal Mock -->
    <!-- In real UniApp, use uni-popup or custom component. Using modal for simplicity -->

  </view>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('category');

const categories = ref([
  { name: '自然风光', icon: '🏔️' },
  { name: '赛博朋克', icon: '🌃' },
  { name: '二次元', icon: '👾' },
  { name: '抽象艺术', icon: '🎨' },
]);

const tags = ref(['4K', '高清', '手机壁纸', '美女', '跑车', '黑暗', '极简', '治愈']);

const showAddModal = (type) => {
  uni.showModal({
    title: type === 'category' ? '新建分类' : '新增标签',
    editable: true,
    placeholderText: '请输入名称',
    success: (res) => {
      if (res.confirm && res.content) {
        if (type === 'category') {
          categories.value.push({ name: res.content, icon: '📁' });
        } else {
          tags.value.push(res.content);
        }
        uni.showToast({ title: '添加成功', icon: 'success' });
      }
    }
  });
};

const removeCategory = (index) => {
  uni.showModal({
    title: '删除分类',
    content: '确定删除该分类吗？',
    success: (res) => {
      if (res.confirm) {
        categories.value.splice(index, 1);
      }
    }
  });
};

const removeTag = (index) => {
  tags.value.splice(index, 1);
};
</script>
