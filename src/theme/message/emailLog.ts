export class EmailLog {
  /**
   * 唯一uid 自增 主键 不使用雪花算法
   */
  uid?: string | null;

  /**
   * 邮件发送的标题 不能为null
   * <p>length < 50</p>
   */
  subject?: string | null;

  /**
   * 邮件发送的内容 不能为null 长度随意
   */
  content?: string | null;

  /**
   * 接收者的邮箱号 不能为null
   * <p>length < 32</p>
   */
  receiver?: string | null;

  /**
   * 发送者的邮箱号 不能为null
   * <p>length < 32</p>
   */
  sender?: string | null;

  /**
   * 邮件发送的状态 true：已成功发送 false：未发送成功
   */
  send?: boolean | null;

  /**
   * 创建时间
   */
  createTime?: string | null;

  /**
   * 更新时间
   */
  updateTime?: string | null;
}
