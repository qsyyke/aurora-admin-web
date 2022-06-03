import { request } from '@/service/request';
import { Category } from '@/theme/article/category';
import { Condition } from '@/theme';

export function insertCategory(category: Category) {
  return request.post('/blog/category', category);
}

export function deleteCategory(categoryUid: string) {
  return request.delete(`/blog/category/${categoryUid}`, {});
}

export function physicsDeleteCategory(categoryUid: string) {
  return request.delete(`/blog/category/physics/${categoryUid}`, {});
}

export function fetchAllCategory(condition: Condition) {
  return request.get<Service.ListResult<Category>>('/blog/category', condition, { params: condition });
}

export function fetchCategoryByUid(categoryUid: string) {
  return request.get<Category>(`/blog/category/${categoryUid}`);
}

export function updateCategory(category: Category) {
  return request.put('/blog/category', category);
}
