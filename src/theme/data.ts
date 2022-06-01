export class Condition {
  // 当前页码数
  pageNum?: number;

  // 长度
  pageSize?: number;

  // 排序字段
  orderBy?: string | null;

  // 开始时间
  startTime?: string | null;

  // 结束时间
  endTime?: string | null;

  // uid
  uid?: string | null;

  // 其他uid
  otherUid?: string | null;

  show?: boolean | null;

  status?: boolean | null;

  delete?: boolean | null;

  // 关键词
  keyword?: string | null;

  otherField?: Object | null;

  constructor(isDelete: boolean | null, status: boolean | null, show: boolean | null) {
    this.delete = isDelete;
    this.status = status;
    this.show = show;
  }
}
