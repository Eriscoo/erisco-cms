import { api } from '../../utils/api'

export interface Tag {
  id: number
  name: string
}

export function getTags() {
  return api.get<Tag[]>('/api/v1/tags')
}

export function createTag(name: string) {
  return api.post<Tag>('/api/v1/tags', { name })
}

export function updateTag(id: number, name: string) {
  return api.put<{ id: number; name: string }>(`/api/v1/tags/${id}`, { name })
}

export function deleteTag(id: number) {
  return api.delete<{ message: string }>(`/api/v1/tags/${id}`)
}
