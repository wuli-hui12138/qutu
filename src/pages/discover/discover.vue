<template>
  <view class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
    <view class="text-4xl mb-4 text-gray-300">🌍</view>
    <text class="text-xl font-black text-gray-900 mb-2">发现更多</text>
    <text class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-10">Exploration Coming Soon</text>
    <button @tap="goBack" class="px-10 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">返回</button>
    <FloatingTabBar />
  </view>
</template>

<script setup>
import FloatingTabBar from '../../components/FloatingTabBar.vue';
const goBack = () => uni.navigateBack();
</script>