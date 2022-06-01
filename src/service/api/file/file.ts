import { AxiosRequestConfig } from 'axios';
import { Condition, User } from '@/theme';
import { AuroraFile, File } from '@/theme/file';
import { request } from '../../request';

export function uploadSingleFile(fileData, storageMode: number, summary: string, userUid: string) {
  return request.post<AuroraFile>(
    '/file/single',
    { file: fileData, storageMode, summary, userUid },
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
}

export function uploadMultiFile(fileData, storageMode: number, summary: string, userUid: string) {
  return request.post<AuroraFile>(
    '/file/multi',
    { files: fileData, storageMode, summary, userUid },
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
}

export function fetchAllFile(condition: Condition) {
  return request.get<Service.ListResult<AuroraFile>>('/file', condition, { params: condition });
}

export function fetchSpecifyFormatFiles(condition: Condition) {
  return request.get<Service.ListResult<AuroraFile>>('/file/formatFile', condition, { params: condition });
}

export function fetchFileByUid(fileUid: string) {
  return request.get<Service.ListResult<AuroraFile>>(`/file/${fileUid}`);
}

export function updateFileInfo(fileInfo: AuroraFile) {
  return request.put('/file', fileInfo);
}

export function deleteFile(fileUid: string) {
  return request.delete(`/file/${fileUid}`, {});
}

export function downloadFileByUid(fileUid: string) {
  return request.get<void>(`/file/download/${fileUid}`);
}
