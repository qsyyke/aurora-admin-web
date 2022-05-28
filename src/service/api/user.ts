import { Condition, User } from '@/theme';
import { request } from '../request';

export function fetchAllUser(condition: Condition) {
  return request.get<Service.ListResult<User>>('/admin/user', condition);
}

export function fetchUserByUserUid(userUid: string) {
  return request.get<any>(`/admin/user/userUid/${userUid}`);
}

export function fetchUserByUsername(username: string) {
  return request.get<any>(`/admin/user/username/${username}`);
}

export function fetchUserByUsernameContainPassword(username: string) {
  return request.get<any>(`/admin/user/pwd/username/${username}`);
}

export function deleteUserByUserUid<T>(userUid: string) {
  return request.delete<T>(`/admin/user/${userUid}`, {});
}

export function addUser(user: User) {
  return request.post('/admin/user', user, {});
}

export function updateUser(user: User) {
  return request.put('/admin/user', user);
}

export function physicsDeleteUser(userUid: string) {
  return request.delete(`/admin/user/delete/${userUid}`, {});
}

export function bindEmailForUser(email: string) {
  return request.put(`/admin/user/bindingEmail/${email}`);
}
