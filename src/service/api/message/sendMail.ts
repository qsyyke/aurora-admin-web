import { request } from '../../request';

export function resendCustomHtmlMailByUid(emailLogUid: string) {
  return request.post(`/message/sendMail/resend/${emailLogUid}`, {});
}

export function sendCustomHtmlMail(subject: string, content: string, receiverEmail: string) {
  return request.post(`/message/sendMail/customMail/`, { subject, content, receiverEmail });
}
