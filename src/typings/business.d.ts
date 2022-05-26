/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   * - custom: 自定义角色
   */
  type RoleType = keyof typeof import('@/enum').EnumUserRole;

  /** 用户信息 */
  interface UserInfo {
    /** 用户名 */
    username: string;
    /** 用户角色类型 */
    userRole: RoleType;
    /** 用户唯一uid */
    userUid: string;
    /** 昵称 */
    nickname: string;
    /** 是否验证邮箱 */
    verifyEmail: boolean;
    /** 角色集合 */
    roleArr: Set;
  }
}

declare namespace Demo {
  interface DataWithAdapter {
    id: string;
    name: string;
  }
}
