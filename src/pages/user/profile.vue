<template>
  <view class="min-h-screen bg-gray-50 pb-32">
    <!-- Header/Background -->
    <view class="relative h-64 bg-black overflow-hidden">
      <view class="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent)]"></view>
      <view class="absolute inset-0 flex flex-col items-center justify-center pt-10">
        <view class="w-24 h-24 rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/20 p-1 mb-4 shadow-2xl">
          <image 
            :src="userInfo.avatar || '/static/logo.png'" 
            mode="aspectFill" 
            class="w-full h-full rounded-[28px]"
          />
        </view>
        <text class="text-white text-xl font-black tracking-tight">{{ userInfo.nickname || '探索者' }}</text>
        <text class="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Digital Identity verified</text>
      </view>
    </view>

    <!-- Stats Card -->
    <view class="px-6 -mt-10 relative z-10">
      <view class="bg-white rounded-[32px] p-8 shadow-xl shadow-black/5 flex justify-between items-center border border-gray-100">
        <view class="text-center flex-1">
          <text class="block text-2xl font-black text-gray-900">{{ stats.creationCount || 0 }}</text>
          <text class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">作品</text>
        </view>
        <view class="w-[1px] h-8 bg-gray-100"></view>
        <view class="text-center flex-1">
          <text class="block text-2xl font-black text-gray-900">{{ stats.likeCount || 0 }}</text>
          <text class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">获赞</text>
        </view>
        <view class="w-[1px] h-8 bg-gray-100"></view>
        <view class="text-center flex-1">
          <text class="block text-2xl font-black text-gray-900">{{ stats.followCount || 0 }}</text>
          <text class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">关注</text>
        </view>
      </view>
    </view>

    <!-- Menu Section -->
    <view class="px-6 mt-8 space-y-4">
      <view @tap="navigateTo('/pages/ai/history')" class="group bg-white p-6 rounded-[24px] flex items-center justify-between border border-gray-100 active:scale-[0.98] transition-all">
        <view class="flex items-center gap-4">
          <view class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <text class="text-lg">🎨</text>
          </view>
          <view>
            <text class="block font-black text-gray-900 text-sm">创作历史</text>
            <text class="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Your AI Generations</text>
          </view>
        </view>
        <text class="text-gray-300">→</text>
      </view>

      <view @tap="navigateTo('/pages/upload/upload')" class="group bg-white p-6 rounded-[24px] flex items-center justify-between border border-gray-100 active:scale-[0.98] transition-all">
        <view class="flex items-center gap-4">
          <view class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <text class="text-lg">📤</text>
          </view>
          <view>
            <text class="block font-black text-gray-900 text-sm">我的发布</text>
            <text class="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Published Works</text>
          </view>
        </view>
        <text class="text-gray-300">→</text>
      </view>

      <view class="group bg-white p-6 rounded-[24px] flex items-center justify-between border border-gray-100 active:scale-[0.98] transition-all">
        <view class="flex items-center gap-4">
          <view class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <text class="text-lg">⚙️</text>
          </view>
          <view>
            <text class="block font-black text-gray-900 text-sm">设置中心</text>
            <text class="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">System Protocols</text>
          </view>
        </view>
        <text class="text-gray-300">→</text>
      </view>
    </view>

    <FloatingTabBar />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import FloatingTabBar from '../../components/FloatingTabBar.vue';
import { usersService } from '../../services/api';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const userInfo = ref({});
const stats = ref({
  creationCount: 0,
  likeCount: 0,
  followCount: 0
});

const fetchProfile = async () => {
  if (!userStore.id) return;
  try {
    // 模拟或调用真实接口
    // const data = await usersService.findOne(userStore.id);
    // userInfo.value = data;
    
    // 临时 Mock 数据
    userInfo.value = {
      nickname: 'Qutu User',
      avatar: ''
    };
    stats.value = {
      creationCount: 12,
      likeCount: 45,
      followCount: 8
    };
  } catch (err) {
    console.error('Fetch profile failed', err);
  }
};

const navigateTo = (url) => {
  uni.navigateTo({ url });
};

onShow(async () => {
  await userStore.initUser();
  fetchProfile();
});
</script>

<style scoped>
/* Page-specific styles */
</style>
