export class MessageLog {
  /**
   * 唯一uid
   */
  uid?: string | null;

  /**
   * 生产者生产的消息
   */
  message?: string | null;

  /**
   * 如果发生错误，则错误消息是什么
   */
  errorMessage?: string | null;

  /**
   * 交换机
   */
  exchange?: string | null;

  /**
   * 队列
   */
  queue?: string | null;

  /**
   * 绑定路由key
   */
  routingKey?: string | null;

  /**
   * 重试次数
   */
  tryCount?: number | null;

  /**
   * 消息消费的状态，true
   */
  consumeStatus?: boolean | null;

  ackStatus?: boolean | null;

  /**
   * 创建时间
   */
  createTime?: string | null;

  /**
   * 修改时间
   */
  updateTime?: string | null;

  /**
   * 交换机类型
   */
  exchangeType?: string | null;
}
