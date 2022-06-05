import { request } from '@/service/request';
import { Link } from '@/theme/article/link';
import { Condition } from '@/theme';

export function deleteLinkByUid(linkUid: string, msg: string) {
  return request.put(`/blog/link/delete`, { uid: linkUid, msg }, {});
}

export function insertLinkInfo(link: Link) {
  return request.post('/blog/link', link);
}

export function fetchLinkByCondition(condition: Condition) {
  return request.get<Service.ListResult<Link>>('/blog/link', condition, { params: condition });
}

export function fetchLinkByUid(linkUid: string) {
  return request.get<Link>(`/blog/link/${linkUid}`);
}

export function updateLink(link: Link) {
  return request.put('/blog/link', link);
}

export function updateLinkPublishStatus(msg: string, publish: boolean, linkUid: string) {
  return request.put('/blog/link/publish', { uid: linkUid, msg, publish });
}
