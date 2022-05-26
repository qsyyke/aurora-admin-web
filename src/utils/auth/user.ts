import { EnumStorageKey } from '@/enum';
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
export function getUserInfo() {
  const emptyInfo: Auth.UserInfo = {
    userUid: '',
    username: '',
    userRole: 'user',
    nickname: '',
    verifyEmail: false,
    roleArr: null
  };
  const userInfo: Auth.UserInfo = getLocal<Auth.UserInfo>(EnumStorageKey['user-info']) || emptyInfo;
  return userInfo;
}

/** 设置用户信息 */
export function setUserInfo(userInfo: Auth.UserInfo) {
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
  removeUserInfo();
}

export function getUserInfoFromJwt(tokenInfo: ApiAuth.Token): Auth.UserInfo {
  // 从accessJwt中获取用户信息
  return new User(
    tokenInfo.nickname,
    tokenInfo.authority,
    'super',
    tokenInfo.user_uid,
    tokenInfo.username,
    tokenInfo.verify_email
  );
}

class User implements Auth.UserInfo {
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
