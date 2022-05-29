import { unref } from 'vue';
import { defineStore } from 'pinia';
import { router } from '@/router';
import { useRouterPush } from '@/composables';
import { fetchLogin } from '@/service';
import {
  getUserInfo,
  getToken,
  setUserInfo,
  setToken,
  setRefreshToken,
  getUserInfoFromJwt,
  clearAuthStorage
} from '@/utils';
import { useTabStore } from '../tab';
import { useRouteStore } from '../route';

interface AuthState {
  /** 用户信息 */
  userInfo: Auth.UserInfo;
  /** 用户token */
  token: string;
  /** 登录的加载状态 */
  loginLoading: boolean;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    userInfo: getUserInfo(),
    token: getToken(),
    loginLoading: false
  }),
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.token);
    }
  },
  actions: {
    /** 重置auth状态 */
    resetAuthStore() {
      console.log('重置auth状态');
      const { toLogin } = useRouterPush(false);
      const { resetTabStore } = useTabStore();
      const { resetRouteStore } = useRouteStore();
      const route = unref(router.currentRoute);

      clearAuthStorage();
      this.$reset();

      resetTabStore();
      resetRouteStore();

      if (route.meta.requiresAuth) {
        toLogin();
      }
    },
    /**
     * 处理登录后成功或失败的逻辑
     * @param backendToken - 返回的token
     */
    async handleActionAfterLogin(backendToken: ApiAuth.Token) {
      const { toLoginRedirect } = useRouterPush(false);

      const loginSuccess = await this.loginByToken(backendToken);

      if (loginSuccess) {
        // 跳转登录后的地址
        toLoginRedirect();
        // 登录成功弹出欢迎提示
        window.$notification?.success({
          title: '登录成功!',
          content: `欢迎回来，${this.userInfo.username}!`,
          duration: 3000
        });

        return;
      }

      // 不成功则重置状态
      this.resetAuthStore();
    },
    /**
     * 根据token进行登录
     * @param backendToken - 返回的token
     */
    async loginByToken(backendToken: ApiAuth.Token) {
      let successFlag = false;
      // 先把token存储到缓存中(后面接口的请求头需要token)
      const { access_token, refresh_token } = backendToken;
      setToken(access_token);
      setRefreshToken(refresh_token);

      // 获取用户信息
      const userInfo = getUserInfoFromJwt(backendToken);
      /** 返回的用户信息 */
      // eslint-disable-next-line camelcase
      if (access_token) {
        // 成功后把用户信息存储到缓存中
        setUserInfo(userInfo);

        // 更新状态
        this.userInfo = userInfo;
        this.token = access_token;

        successFlag = true;
      }

      return successFlag;
    },
    /**
     * 登录
     * @param username
     * @param password - 密码
     */
    async login(username: string, password: string) {
      this.loginLoading = true;
      const { data } = await fetchLogin(username, password);
      if (data) {
        await this.handleActionAfterLogin(data);
      }
      this.loginLoading = false;
    },
    /**
     * 更换用户权限(切换账号)
     * @param userRole
     */
    async updateUserRole(userRole: Auth.RoleType) {
      const { resetRouteStore, initAuthRoute } = useRouteStore();

      const accounts: Record<Auth.RoleType, { username: string; password: string }> = {
        super: {
          username: 'Super',
          password: 'super123'
        },
        admin: {
          username: 'Admin',
          password: 'admin123'
        },
        user: {
          username: 'User01',
          password: 'user01123'
        }
      };
      const { username, password } = accounts[userRole];
      const { data } = await fetchLogin(username, password);
      if (data) {
        await this.loginByToken(data);
        resetRouteStore();
        initAuthRoute();
      }
    }
  }
});
