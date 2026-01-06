<template>
  <view class="fixed-bottom-nav">
    <view class="nav-container">
      <view 
        v-for="item in tabs" 
        :key="item.path" 
        @tap="switchTab(item.path)"
        :class="['nav-item', currentPath === item.path ? 'active' : '']"
      >
        <view class="icon-wrapper">
          <view v-html="currentPath === item.path ? item.activeIcon : item.icon" class="svg-icon"></view>
          <view v-if="currentPath === item.path" class="active-dot"></view>
        </view>
        <text class="nav-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const currentPath = ref('/pages/index/index');

const tabs = [
  {
    label: '浏览',
    path: '/pages/index/index',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    activeIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    label: '发现',
    path: '/pages/discover/discover',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    activeIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  },
  {
    label: '创作',
    path: '/pages/ai/generator',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
    activeIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>'
  },
  {
    label: '历史',
    path: '/pages/ai/history',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V12L15 15"/><circle cx="12" cy="12" r="10"/></svg>',
    activeIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M12 8V12L15 15"/><circle cx="12" cy="12" r="10"/></svg>'
  }
];

const switchTab = (path) => {
  if (currentPath.value === path) return;
  uni.reLaunch({
    url: path
  });
};

onMounted(() => {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  if (page) {
    currentPath.value = '/' + page.route;
  }
});
</script>

<style scoped>
.fixed-bottom-nav {
  position: fixed;
  bottom: 30rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 999;
  pointer-events: none;
}

.nav-container {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  padding: 12rpx 40rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  gap: 60rpx;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  transition: all 0.3s ease;
  position: relative;
}

.icon-wrapper {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.svg-icon {
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-item.active .svg-icon {
  color: #000;
  transform: translateY(-2rpx);
}

.nav-label {
  font-size: 20rpx;
  font-weight: 800;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-item.active .nav-label {
  color: #000;
}

.active-dot {
  position: absolute;
  bottom: -15rpx;
  width: 8rpx;
  height: 8rpx;
  background: #000;
  border-radius: 50%;
  animation: dotIn 0.3s ease-out;
}

@keyframes dotIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.nav-item:active {
  transform: scale(0.9);
}
</style>
