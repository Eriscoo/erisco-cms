import { api } from '../../utils/api'

export interface Category {
  id: number
  name: string
}

export function getCategories() {
  return api.get<Category[]>('/api/v1/categories')
}

export function createCategory(name: string) {
  return api.post<Category>('/api/v1/categories', { name })
}

export function updateCategory(id: number, name: string) {
  return api.put<{ id: number; name: string }>(`/api/v1/categories/${id}`, { name })
}

export function deleteCategory(id: number) {
  return api.delete<{ message: string }>(`/api/v1/categories/${id}`)
}
