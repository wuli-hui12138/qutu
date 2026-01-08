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
                 <text class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-500">{{ img.categories?.[0]?.name || '默认' }}</text>
                 <text 
                   class="text-xs px-2 py-0.5 rounded"
                   :class="img.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                   @tap.stop="toggleOneStatus(img)"
                 >
                   {{ img.statusDisplay }}
                 </text>
              </view>
            </view>
            <view class="flex justify-end gap-3 text-sm" v-if="!multiSelect">
              <text class="text-blue-600" @tap.stop="toggleOneStatus(img)">{{ img.isPublished ? '下架' : '通过' }}</text>
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
      <button class="flex-1 bg-green-100 text-green-700 font-bold" @tap="statusAction">一键通过</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { wallpapersService } from '../../services/api';

const multiSelect = ref(false);
const selected = ref([]);
const images = ref([]);

const fetchImages = async () => {
  try {
    const res = await wallpapersService.findAllAdmin();
    images.value = res.map(img => ({
      ...img,
      // Map status
      statusDisplay: img.status === 'APPROVED' ? '已发布' : '审核中',
      isPublished: img.status === 'APPROVED'
    }));
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchImages();
});

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
  uni.navigateTo({ url: `/pages/upload/upload?id=${img.id}` }); 
};

const toggleOneStatus = async (img) => {
  const newStatus = img.status === 'APPROVED' ? 'PENDING' : 'APPROVED';
  try {
    await wallpapersService.updateStatus(img.id, newStatus);
    uni.showToast({ title: newStatus === 'APPROVED' ? '已发布' : '已下架', icon: 'success' });
    fetchImages();
  } catch (err) {
    uni.showToast({ title: '操作失败', icon: 'none' });
  }
};

const remove = (id) => {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确定要删除吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await wallpapersService.remove(id);
          images.value = images.value.filter(i => i.id !== id);
          uni.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          uni.showToast({ title: '删除失败', icon: 'none' });
        }
      }
    }
  });
};

const deleteSelected = () => {
  if (selected.value.length === 0) return;
  uni.showModal({
    title: '批量删除',
    content: `确定删除选中的 ${selected.value.length} 个作品吗？`,
    success: async (res) => {
      if (res.confirm) {
        // Sequential delete
        for (const id of selected.value) {
            try {
                await wallpapersService.remove(id);
            } catch (e) { console.error(e) }
        }
        fetchImages();
        selected.value = [];
        multiSelect.value = false;
        uni.showToast({ title: '删除成功', icon: 'success' });
      }
    }
  });
};

const statusAction = async () => {
    // Bulk toggle? Or just strict set?
    // Let's implement bulk approve for simplicity
    for (const id of selected.value) {
        try {
            await wallpapersService.updateStatus(id, 'APPROVED');
        } catch (e) { console.error(e) }
    }
    uni.showToast({ title: '批量发布成功', icon: 'success' });
    fetchImages();
    multiSelect.value = false;
    selected.value = [];
};
</script>

<style>
.p-b-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
