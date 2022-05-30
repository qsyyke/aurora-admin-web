import { request } from '../../request';

export function resendCustomHtmlMailByUid(emailLogUid: string) {
  return request.post(`/message/sendMail/resend/${emailLogUid}`, {});
}
