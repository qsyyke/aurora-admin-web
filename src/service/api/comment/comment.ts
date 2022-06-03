import { Condition } from '@/theme';
import { Comment, CommentDTO, ShowCommentVO } from '@/theme/comment';
import { request } from '../../request';

export function insertComment(commentInfo: Comment) {
  return request.post('/comment', commentInfo);
}

export function resendCommentEmailNotice(commentUid: string) {
  return request.post(`/comment/resendEmail/${commentUid}`, null, {});
}

export function deleteComment(commentUid: string) {
  return request.delete(`/comment/${commentUid}`, {});
}

export function updateComment(commentInfo: Comment) {
  return request.put('/comment', commentInfo);
}

export function fetchAllComment(uidArr: string) {
  return request.get<ShowCommentVO>('/comment/queryArticleComments', uidArr, { params: uidArr });
}

export function fetchAllCommentByCondition(condition: Condition) {
  return request.get<Service.ListResult<Comment>>('/comment', condition, { params: condition });
}

export async function fetchCommentByUid(commentUid: string) {
  return request.get<CommentDTO>(`/comment/${commentUid}`);
}
