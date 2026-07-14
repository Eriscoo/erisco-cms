import { api } from '../../utils/api'

export interface Post {
  id: number
  title: string
  slug: string
  body: string
  image_url: string
  categories: string
  category_names: string
  tags: string
  tag_names: string
  created_by: number
  created_by_name: string
  author_avatar_url: string
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export function getPosts() {
  return api.get<Post[]>('/api/v1/posts')
}

export function getPost(id: number) {
  return api.get<Post>(`/api/v1/posts/${id}`)
}

export function getPostBySlug(slug: string) {
  return api.get<Post>(`/api/v1/public/posts/${slug}`)
}

export function getPublicPosts() {
  return api.get<Post[]>('/api/v1/public/posts/all')
}

export function createPost(data: { title: string; slug?: string; body?: string; image_url?: string; categories?: string; tags?: string; status?: string }) {
  return api.post<Post>('/api/v1/posts', data)
}

export function updatePost(id: number, data: Partial<Post>) {
  return api.put<Post>(`/api/v1/posts/${id}`, data)
}

export function deletePost(id: number) {
  return api.delete<{ message: string }>(`/api/v1/posts/${id}`)
}
