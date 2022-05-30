import { Condition } from '@/theme';
import { LoginLog } from '@/theme/auth';
import { request } from '../../request';

export function deleteLoginLogByUid(loginLogUid: string) {
  return request.delete(`/login/loginInfo/${loginLogUid}`, {});
}

export function deleteLoginLogBatch(loginUids: string) {
  return request.post('/message/email', loginUids);
}

export function fetchAllLoginLog(condition: Condition) {
  return request.get<Service.ListResult<LoginLog>>('/login/loginInfo', condition, { params: condition });
}

export function fetchLoginLogByUsername(username: string) {
  return request.get<LoginLog>(`/login/loginInfo/${username}`);
}
