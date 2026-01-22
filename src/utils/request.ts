import axios, { type AxiosRequestConfig } from 'axios'

const baseUrl = 'http://localhost:5174/api'

axios.interceptors.request.use(function (config) {
  console.log('请求拦截器')
  let { url } = config
  if (url && url.startsWith('/')) {
    url = `${baseUrl}${url}`
  } else if (url) {
    url = `${baseUrl}/${url}`
  }
  return {
    ...config,
    url,
  }
})

axios.interceptors.response.use((response) => {
  console.log('响应拦截器')
  return response
})

export default async function Axios(options: AxiosRequestConfig) {
  const response = await axios(options)
  const {
    status,
    statusText,
    data: { data, code, message },
  } = response
  return {
    status,
    statusText,
    data,
    code,
    message,
  }
}
