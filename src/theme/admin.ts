import { Email } from '@/theme/message';

export class User {
  /**
   * 用户唯一id
   */
  uid?: string | null;

  /**
   * 用户简介
   */
  userSummary?: string | null;

  /**
   * 账户是否被锁住
   */
  accountLock?: boolean | null;

  /**
   * 是否验证了邮箱
   */
  verifyEmail?: boolean | null;

  /**
   * 用户昵称
   */
  nickname?: string | null;

  password?: string | null;

  /**
   * 用户性别
   */
  gender?: string | null;

  /**
   * 该用户对应的网站设置的uid
   */
  siteUid?: string | null;

  /**
   * 用户头像
   */
  avatar?: string | null;

  /**
   * 用户级别 0：管理员 1：普通用户
   */
  userLevel?: number | null;

  /**
   * 用户名（和用户昵称不同，用户名唯一，昵称只要符合要求都行）
   */
  username?: string | null;

  /**
   * 专业
   */
  profession?: string | null;

  /**
   * 该用户对应的邮箱设置uid
   */
  emailUid?: string | null;

  /**
   * 创建时间
   */
  createTime?: string | null;

  /**
   * 更新时间
   */
  updateTime?: string | null;

  /**
   * 是否被删除
   */
  delete?: boolean;

  email?: Email | null;
}
