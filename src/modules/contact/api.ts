import { api } from '../../utils/api'

interface SubmitPayload {
  name?: string
  email: string
  subject?: string
  phone?: string
  message?: string
  'cf-turnstile-response': string
}

export async function submitContact(data: SubmitPayload): Promise<{ message: string }> {
  return api.post('/api/v1/contact', data)
}
