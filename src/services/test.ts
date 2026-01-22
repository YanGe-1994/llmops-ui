import request from '@/utils/request.ts'

export const debug = (data: Record<string, any>) => {
  return request({
    method: 'post',
    url: 'app/completion',
    data: data,
  })
}
