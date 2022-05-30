import { Condition } from '@/theme';
import { MessageLog } from '@/theme/message/messageLog';
import { request } from '../../request';

export function updateMessageLog(messageLog: MessageLog) {
  return request.put(`/message/messageLog`, messageLog);
}

export function deleteMessageLog(messageLogUid: string) {
  return request.delete(`/message/messageLog/${messageLogUid}`, {});
}

export function fetchAllMessageLog(condition: Condition) {
  return request.get<Service.ListResult<MessageLog>>(`/message/messageLog`, condition, { params: condition });
}

export function fetchMessageLogByUid(messageLogUid: string) {
  return request.get<MessageLog>(`/message/messageLog/${messageLogUid}`, {});
}

export function resendRabbitMqMessage(messageLogUid: string) {
  return request.post(`/message/messageLog/resend/${messageLogUid}`);
}
