import { Condition } from '@/theme';
import { EmailLog } from '@/theme/message/emailLog';
import { request } from '../../request';

export function deleteEmailLogByUid(emailUid: string) {
  return request.delete(`/message/emailLog/${emailUid}`, {});
}

export function updateEmailLogByUid(emailLog: EmailLog) {
  return request.put('/message/emailLog', emailLog);
}

export function fetchAllEmailLog(condition: Condition) {
  return request.get<Service.ListResult<EmailLog>>('/message/emailLog', condition, { params: condition });
}
