import { api } from '../../utils/api'

export async function login(email: string, password: string) {
  return api.post<{ token: string }>('/api/v1/login', { email, password })
}

export async function register(name: string, email: string, password: string) {
  return api.post<{ token: string }>('/api/v1/register', { name, email, password })
}
