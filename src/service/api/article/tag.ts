import { request } from '@/service/request';
import { Tag } from '@/theme/article/tag';
import { Condition } from '@/theme';

export function insertTag(tag: Tag) {
  return request.post('/blog/tag', tag);
}

export function deleteTagByUid(tagUid: string) {
  return request.delete(`/blog/tag/${tagUid}`, {});
}

export function physicsDeleteTag(tagUid: string) {
  return request.delete(`/blog/tag/physics/${tagUid}`, {});
}

export function fetchAllTagByCondition(condition: Condition) {
  return request.get<Service.ListResult<Tag>>('/blog/tag', condition, { params: condition });
}

export function selectTagByUid(tagUid: string) {
  return request.get<Tag>(`/blog/tag/${tagUid}`);
}

export function updateTag(tag: Tag) {
  return request.put('/blog/tag', tag);
}
