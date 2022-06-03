import { request } from '@/service/request';
import { Talk } from '@/theme/article/talk';
import { Condition } from '@/theme';

export function insertTalk(talk: Talk) {
  return request.post('/blog/tag', talk);
}

export function deleteTalkByUid(talkUid: string) {
  return request.delete(`/blog/tag/${talkUid}`, {});
}

export function physicsDeleteTalk(talkUid: string) {
  return request.delete(`/blog/tag/physics/${talkUid}`, {});
}

export function fetchAllTalkByCondition(condition: Condition) {
  return request.get<Service.ListResult<Talk>>('/blog/tag', condition, { params: condition });
}

export function fetchTalkByUid(talkUid: string) {
  return request.get<Talk>(`/blog/tag/${talkUid}`);
}

export function updateTalk(talk: Talk) {
  return request.put('/blog/tag', talk);
}
