import { request } from '@/service/request';
import { Bulletin } from '@/theme/article/bulletin';
import { Condition } from '@/theme';

export function deleteBulletin(bulletinUid: string) {
  return request.delete(`/blog/bulletin/${bulletinUid}`, {});
}

export function physicsDeleteBulletin(bulletinUid: string) {
  return request.delete(`/blog/bulletin/physics/${bulletinUid}`, {});
}

export function insertBulletin(bulletin: Bulletin) {
  return request.post('/blog/bulletin', bulletin);
}

export function updateBulletin(bulletin: Bulletin) {
  return request.put('/blog/bulletin', bulletin);
}

export function fetchAllBulletin(condition: Condition) {
  return request.get<Service.ListResult<Bulletin>>('/blog/bulletin', condition, { params: condition });
}

export function fetchBulletinByUid(bulletinUid: string) {
  return request.get<Bulletin>(`/blog/bulletin/${bulletinUid}`);
}
