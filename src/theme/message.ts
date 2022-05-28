export class Email {
  /**
   * 唯一uid，不能为null，主键
   */
  uid?: string | null;

  /**
   * 此邮箱配置对应哪个用户 可以为null
   */
  userUid?: string | null;

  /**
   * 邮箱主机 可以为null
   * <p>length < 25</p>
   */
  emailHost?: string | null;

  /**
   * 邮箱协议 可以为null
   * <p>length < 10</p>
   */
  protocol?: string | null;

  /**
   * 邮件服务的端口
   */
  port?: number | null;

  /**
   * 邮箱号
   */
  email?: string | null;

  /**
   * 创建时间
   */
  createTime?: string | null;

  /**
   * 更新时间
   */
  updateTime?: string | null;
}
