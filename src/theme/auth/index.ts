export class LoginLog {
  uid?: string | null;

  /**
   * 登录的用户名
   */
  username?: string | null;

  /**
   * 登录地
   */
  loginLocation?: string | null;

  /**
   * 登录ip地址
   */
  loginIp?: string | null;

  /**
   * 登录的操作系统
   */
  operationSystemInfo?: string | null;

  /**
   * 创建时间
   */
  createTime?: string | null;

  /**
   * 最后更新时间
   */
  updateTime?: string | null;

  message?: string | null;

  /**
   * 登录的状态 1：登录成功
   */
  status?: boolean;
}
