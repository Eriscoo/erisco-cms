import { api } from '../../utils/api'

export interface UserProfile {
  user_id: number
  bio: string
  avatar_url: string
  website: string
  location: string
  phone: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileReq {
  bio?: string
  avatar_url?: string
  website?: string
  location?: string
  phone?: string
}

export function getProfile(userId: number) {
  return api.get<UserProfile>(`/api/v1/profile/${userId}`)
}

export function updateProfile(userId: number, data: UpdateProfileReq) {
  return api.put<UserProfile>(`/api/v1/profile/${userId}`, data)
}
