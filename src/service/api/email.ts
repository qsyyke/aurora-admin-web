import { Condition } from '@/theme';
import { Email } from '@/theme/message';
import { request } from '../request';

export function insertEmail(email: Email) {
  return request.post('/message/email', email);
}

export function deleteEmailByUid(emailUid: string) {
  return request.delete(`/message/email/${emailUid}`, {});
}

export function updateEmailByUid(email: Email) {
  return request.put('/message/email', email);
}

export function fetchAllEmail(condition: Condition) {
  return request.get<Service.ListResult<Email>>('/message/email', condition);
}

export async function fetchEmailByUid(emailUid: string) {
  return request.get<Email>(`/message/email/${emailUid}`);
}

export function fetchEmailByUserUid(userUid: string) {
  return request.get<Email>(`/message/email/userUid/${userUid}`);
}

export function fetchEmailByEmail(email: string) {
  return request.get<Email>(`/message/email/email/${email}`);
}
