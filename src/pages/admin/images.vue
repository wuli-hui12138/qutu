<template>
  <view class="min-h-screen bg-gray-50 dark:bg-black pb-10">
    <view class="p-4">
      <view class="flex justify-between items-center mb-4">
        <text class="text-sm text-gray-500">共 {{ images.length }} 个作品</text>
        <view class="text-sm font-bold text-blue-600" @tap="toggleMultiSelect">{{ multiSelect ? '取消' : '批量管理' }}</view>
      </view>

      <view class="space-y-3">
        <view 
          v-for="img in images" 
          :key="img.id" 
          class="bg-white dark:bg-zinc-900 rounded-xl p-3 flex gap-3 shadow-sm border border-transparent"
          :class="{'border-blue-500': selected.includes(img.id)}"
          @tap="handleSelect(img.id)"
        >
          <image :src="img.url" mode="aspectFill" class="w-20 h-20 rounded-lg bg-gray-200" />
          <view class="flex-1 flex flex-col justify-between py-1">
            <view>
              <text class="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{{ img.title }}</text>
              <view class="flex gap-2 mt-1">
                 <text class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-500">{{ img.category }}</text>
                 <text 
                   class="text-xs px-2 py-0.5 rounded"
                   :class="img.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                 >
                   {{ img.status === 'published' ? '已发布' : '审核中' }}
                 </text>
              </view>
            </view>
            <view class="flex justify-end gap-3 text-sm" v-if="!multiSelect">
              <text class="text-blue-600" @tap.stop="edit(img)">编辑</text>
              <text class="text-red-600" @tap.stop="remove(img.id)">删除</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Bottom Actions for MultiSelect -->
    <view 
      v-if="multiSelect" 
      class="fixed bottom-0 inset-x-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-white/10 p-4 flex gap-4 z-50 p-b-safe"
    >
      <button class="flex-1 bg-red-100 text-red-600 font-bold" @tap="deleteSelected">删除选中 ({{ selected.length }})</button>
      <button class="flex-1 bg-gray-100 text-gray-900 font-bold" @tap="toggleStatus">下架/上架</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const multiSelect = ref(false);
const selected = ref([]);

const images = ref([
  { id: 1, title: '赛博朋克城市夜景', url: 'https://picsum.photos/200?random=1', category: '科幻', status: 'published' },
  { id: 2, title: '极简山水画', url: 'https://picsum.photos/200?random=2', category: '自然', status: 'published' },
  { id: 3, title: '二次元少女', url: 'https://picsum.photos/200?random=3', category: '动漫', status: 'pending' },
  { id: 4, title: '抽象纹理背景', url: 'https://picsum.photos/200?random=4', category: '抽象', status: 'published' },
]);

const toggleMultiSelect = () => {
  multiSelect.value = !multiSelect.value;
  selected.value = [];
};

const handleSelect = (id) => {
  if (!multiSelect.value) return;
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(i => i !== id);
  } else {
    selected.value.push(id);
  }
};

const edit = (img) => {
  uni.showToast({ title: '跳转编辑: ' + img.title, icon: 'none' });
  // uni.navigateTo({ url: `/pages/upload/upload?id=${img.id}` }); 
};

const remove = (id) => {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确定要删除吗？',
    success: (res) => {
      if (res.confirm) {
        images.value = images.value.filter(i => i.id !== id);
        uni.showToast({ title: '已删除', icon: 'success' });
      }
    }
  });
};

const deleteSelected = () => {
  if (selected.value.length === 0) return;
  uni.showModal({
    title: '批量删除',
    content: `确定删除选中的 ${selected.value.length} 个作品吗？`,
    success: (res) => {
      if (res.confirm) {
        images.value = images.value.filter(i => !selected.value.includes(i.id));
        selected.value = [];
        multiSelect.value = false;
        uni.showToast({ title: '删除成功', icon: 'success' });
      }
    }
  });
};

const toggleStatus = () => {
   uni.showToast({ title: '状态已更新', icon: 'success' });
   multiSelect.value = false;
   selected.value = [];
};
</script>

<style>
.p-b-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
