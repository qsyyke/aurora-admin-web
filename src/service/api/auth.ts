import { mockRequest, request } from '../request';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}

/**
 * 登录
 * @param username
 * @param password - 密码
 */
export function fetchLogin(username: string, password: string) {
  return request.post<Service.BackendResultConfig>(
    '/oauth/token',
    { username, password, client_id: 'myjszl', client_secret: '123456', grant_type: 'password' },
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );
  // return mockRequest.post<ApiAuth.Token>("/login", { username, password })
}

/** 获取用户信息 */
export function fetchUserInfo(username: string) {
  return request.get<ApiAuth.UserInfo>(`/admin/user/${username}`);
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return mockRequest.post<ApiAuth.Token>('/updateToken', { refreshToken });
}
