import { EnumStorageKey } from '@/enum';
import { fetchUserByUserUid } from '@/service';
import { User } from '@/theme';
import { Email } from '@/theme/message';
import { fetchEmailByUserUid } from '@/service/api/message/email';
import { getLocal, removeLocal, setLocal } from '../storage';

/** 设置token */
export function setToken(token: string) {
  setLocal(EnumStorageKey.token, `bearer ${token}`);
}

/** 获取token */
export function getToken() {
  return getLocal<string>(EnumStorageKey.token) || '';
}

/** 去除token */
export function removeToken() {
  removeLocal(EnumStorageKey.token);
}

/** 获取refresh token */
export function getRefreshToken() {
  return getLocal<string>(EnumStorageKey['refresh-token']) || '';
}

/** 设置refresh token */
export function setRefreshToken(token: string) {
  setLocal(EnumStorageKey['refresh-token'], `bearer ${token}`);
}

/** 去除refresh token */
export function removeRefreshToken() {
  removeLocal(EnumStorageKey['refresh-token']);
}

/** 获取用户信息 */
export function getAuthUserInfo() {
  const emptyInfo: Auth.UserInfo = {
    userUid: '',
    username: '',
    userRole: 'user',
    nickname: '',
    verifyEmail: false,
    roleArr: null
  };
  return getLocal<Auth.UserInfo>(EnumStorageKey['auth_user-info']) || emptyInfo;
}

/** 设置用户信息 */
export function setAuthUserInfo(userInfo: Auth.UserInfo) {
  setLocal(EnumStorageKey['auth_user-info'], userInfo);
}

/** 去除用户信息 */
export function removeAuthUserInfo() {
  removeLocal(EnumStorageKey['auth_user-info']);
}

/** 获取用户信息 */
export function getUserInfoFromStorage() {
  const emptyInfo: User = new User();
  const userInfo: User = getLocal<User>(EnumStorageKey['user-info']) || emptyInfo;
  if (!userInfo.email) {
    userInfo.email = new Email();
  }
  return userInfo;
}

/** 设置用户信息 */
export function setUserInfo(userInfo: User) {
  setLocal(EnumStorageKey['user-info'], userInfo);
}

/** 去除用户信息 */
export function removeUserInfo() {
  removeLocal(EnumStorageKey['user-info']);
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  removeToken();
  removeRefreshToken();
  removeAuthUserInfo();
  removeUserInfo();
}

export function loadUserInfo(userUid: string) {
  // 获取用户的信息
  return fetchUserByUserUid(userUid).then(data => {
    if (data.success) {
      const userInfo = data.data;
      setUserInfo(data.data);

      // 获取用户邮箱信息，可能服务没有启动
      fetchEmailByUserUid(userUid).then(res => {
        if (res.success) {
          userInfo.email = res.data;
          setUserInfo(userInfo);
        }
      });
    }
  });
}

class AuthUser implements Auth.UserInfo {
  constructor(
    nickname: string,
    roleArr: Set<string>,
    userRole: Auth.RoleType,
    userUid: string,
    username: string,
    verifyEmail: boolean
  ) {
    this.nickname = nickname;
    this.roleArr = roleArr;
    this.userRole = userRole;
    this.userUid = userUid;
    this.username = username;
    this.verifyEmail = verifyEmail;
  }

  nickname: string;

  roleArr: Set<string>;

  userRole: Auth.RoleType;

  userUid: string;

  username: string;

  verifyEmail: boolean;
}

export function getUserInfoFromJwt(tokenInfo: ApiAuth.Token): Auth.UserInfo {
  // 从accessJwt中获取用户信息
  return new AuthUser(
    tokenInfo.nickname,
    tokenInfo.authority,
    'super',
    tokenInfo.user_uid,
    tokenInfo.username,
    tokenInfo.verify_email
  );
}
