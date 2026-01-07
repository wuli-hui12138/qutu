<script>
import { useUserStore } from './store/user';
import { useThemeStore } from './store/theme';

export default {
  onLaunch: function () {
    console.log("App Launch");
    const userStore = useUserStore();
    userStore.initUser();

    // Init Theme
    const themeStore = useThemeStore();
    themeStore.initTheme();
    
    // Subscribe to changes to update DOM immediately (for H5)
    themeStore.$subscribe((mutation, state) => {
      /* #ifdef H5 */
      if (state.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      /* #endif */
    });
  },
  onShow: function () {
    console.log("App Show");
    // Ensure initial state is applied
    const themeStore = useThemeStore();
    /* #ifdef H5 */
    if (themeStore.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    /* #endif */
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="postcss">
/* Each page public css */
@import './index.css';

/* Global Page Entry Animation */
page {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
