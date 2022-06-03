import { Article } from '@/theme/article/article';
import { Condition } from '@/theme';
import { request } from '../../request';

export function insertArticle(article: Article) {
  return request.post('/blog/article', article);
}

export function deleteArticleByUid(articleUid: string) {
  return request.delete(`/blog/article/${articleUid}`, {});
}

export function physicsDeleteArticleByUid(articleUid: string) {
  return request.delete(`/blog/article/physics/${articleUid}`, {});
}

export function updateArticle(article: Article) {
  return request.put('/blog/article', article, {});
}

export function fetchArticleByUid(articleUid: string) {
  return request.get<Article>(`/blog/article/${articleUid}`);
}

export function fetchArticleByCondition(condition: Condition) {
  return request.get<Service.ListResult<Article>>('/blog/article', condition, { params: condition });
}
