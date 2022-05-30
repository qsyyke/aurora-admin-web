import { Condition, User } from '@/theme';
import { File } from '@/theme/file';
import { request } from '../../request';

export function uploadSingleFile(data) {
  return request.post<File>('/file/single', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function uploadMultiFile(condition: Condition) {
  return request.post<Service.ListResult<Array<File>>>('/file/single', condition, { params: condition });
}

export function fetchAllFile(condition: Condition) {
  return request.get<Service.ListResult<User>>('/file', condition, { params: condition });
}

export function fetchFileByUid(fileUid: string) {
  return request.get<Service.ListResult<File>>(`/file/${fileUid}`);
}

export function updateFileInfo(fileInfo: File) {
  return request.put('/file', fileInfo);
}

export function deleteFile(fileUid: string) {
  return request.delete(`/file/${fileUid}`, {});
}

export function downloadFileByUid(fileUid: string) {
  return request.get<void>(`/file/download/${fileUid}`);
}
