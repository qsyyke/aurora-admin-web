export class Comment {
  /**
   * 唯一uid 不能为null 主键
   */
  uid?: string | null;

  /**
   * 此评论对应注册用户中的哪个用户
   */
  userUid?: string | null;

  /**
   * 是否逻辑删除
   */
  delete?: string | null;

  /**
   * 评论这的用户名 不能为null
   * <p>length < 15</p>
   */
  username?: string | null;

  /**
   * 头像地址 可以为null
   * <p>length < 255</p>
   */
  avatar?: string | null;

  /**
   * 站点地址 不能为null
   * <p>length < 255</p>
   */
  site?: string | null;

  /**
   * 邮箱地址 不能为null 用于接收邮件
   * <p>length < 32</p>
   */
  email?: string | null;

  /**
   * 创建时间 不能为null
   * <p>mysql -> datetime</p>
   */
  createTime?: string | null;

  /**
   * 最后修改时间 可以为null
   * <p>mysql -> datetime</p>
   */
  updateTime?: string | null;

  /**
   * 评论者的ip 可以为null
   * <p>length < 12</p>
   */
  commentIp?: string | null;

  /**
   * 评论者的操作系统信息 可以为null
   * <p>length < 200</p>
   */
  operationSystemInfo?: string | null;

  /**
   * 是否显示此条评论 true：显示 false：不显示
   */
  showComment?: boolean | null;

  /**
   * 此条评论是回复哪条评论的 不能为null
   */
  replyCommentUid?: string | null;

  /**
   * 是否发送邮件通知
   */
  emailNotice?: boolean | null;

  /**
   * 评论内容
   */
  content?: string | null;

  /**
   * 此评论在哪个页面上的评论
   */
  path?: string | null;

  /**
   * 此评论所对应的所有子评论集合，使用,分割开的
   */
  nextCommentUidArray?: string | null;

  /**
   * 此评论是在哪种类型的页面上发布的，可以是说说，文章等
   */
  pageType?: string | null;

  /**
   * 如果此评论是在说说发布的，那么此pageUid就表示说说的uid
   */
  pageUid?: string | null;
}

export class ShowCommentVO {
  /** 此评论对应的文章的uid，或者是友情链接等的uid * */
  articleUid?: string | null;

  /** 此评论对应的页面的类型 * */
  pageType?: string | null;

  /** 此页面的所有父评论的个数，也就是一级评论数 * */
  parentNodeNum?: string | null;

  /** 展示所有的评论 * */
  commentList?: Array<CommentDTO> | null;
}

export class CommentVO {
  /**
   * 唯一uid 不能为null 主键
   */
  uid?: string | null;

  /**
   * 此评论对应注册用户中的哪个用户
   */

  userUid?: string | null;

  /**
   * 是否逻辑删除
   */
  delete?: string | null;

  /**
   * 评论这的用户名 不能为null
   * <p>length < 15</p>
   */
  username?: string | null;

  /**
   * 头像地址 可以为null
   * <p>length < 255</p>
   */
  avatar?: string | null;

  /**
   * 站点地址 不能为null
   * <p>length < 255</p>
   */
  site?: string | null;

  /**
   * 邮箱地址 不能为null 用于接收邮件
   * <p>length < 32</p>
   */
  email?: string | null;

  /**
   * 创建时间 不能为null
   * <p>mysql -> datetime</p>
   */
  createTime?: string | null;

  /**
   * 最后修改时间 可以为null
   * <p>mysql -> datetime</p>
   */
  updateTime?: string | null;

  /**
   * 评论者的ip 可以为null
   * <p>length < 12</p>
   */
  commentIp?: string | null;

  /**
   * 评论者的操作系统信息 可以为null
   * <p>length < 200</p>
   */
  operationSystemInfo?: string | null;

  /**
   * 是否显示此条评论 true：显示 false：不显示
   */
  showComment?: string | null;

  /**
   * 此条评论是回复哪条评论的 不能为null
   */
  replyCommentUid?: string | null;

  /**
   * 是否发送邮件通知
   */
  emailNotice?: string | null;

  /**
   * 评论内容
   */
  content?: string | null;

  /**
   * 此评论在哪个页面上的评论
   */
  path?: string | null;

  /**
   * 此评论所对应的所有子评论集合，使用,分割开的
   */
  nextCommentUidArray?: string | null;

  /**
   * 此评论是在哪种类型的页面上发布的，可以是说说，文章等
   */
  pageType?: string | null;

  /**
   * 如果此评论是在说说发布的，那么此pageUid就表示说说的uid
   */
  pageUid?: string | null;
}

export class CommentDTO {
  /**
   * 唯一uid 不能为null 主键
   */
  uid?: string | null;

  /**
   * 评论这的用户名 不能为null
   * <p>length < 15</p>
   */
  username?: string | null;

  /**
   * 逻辑删除
   */
  delete?: boolean | null;

  /**
   * 头像地址 可以为null
   * <p>length < 255</p>
   */
  avatar?: string | null;

  /**
   * 站点地址 不能为null
   * <p>length < 255</p>
   */
  site?: string | null;

  /**
   * 创建时间 不能为null
   * <p>mysql -> datetime</p>
   */
  createTime?: string | null;

  /**
   * 评论者的操作系统信息 可以为null
   * <p>length < 200</p>
   */
  operationSystemInfo?: string | null;

  /**
   * 此条评论是回复哪条评论的 不能为null
   */
  replyCommentUid?: string | null;

  /**
   * 评论的内容
   */
  content?: string | null;

  /**
   * 此评论对应的页面地址
   */
  path?: string | null;

  /**
   * 此评论对应此页面的用户
   */
  userUid?: string | null;

  sonCommentList?: Array<CommentDTO> | null;

  nextCommentUidArray?: string | null;

  commentIp?: string | null;
}
