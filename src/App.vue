<script>
import { useUserStore } from './store/user';

export default {
  onLaunch: function () {
    console.log("App Launch");
    const userStore = useUserStore();
    userStore.initUser();
  },
  onShow: function () {
    console.log("App Show");
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
