import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import router from './router'

const DEFAULT_CONTENT_TYPE: string = 'application/json'

const getBaseUrl = (): string => {
  return window.GLOBAL_CONFIG.API_URL
}

const getApiUrl = (r: string): string => {
  if (r === 'auth') {
    return `${getBaseUrl()}`
  }

  return `${getBaseUrl()}`
}

const requestMiddleware = (config: InternalAxiosRequestConfig) => {
  config.baseURL = getApiUrl(config.url ?? '')
  config.headers['Accept'] = DEFAULT_CONTENT_TYPE
  config.headers['Content-Type'] = DEFAULT_CONTENT_TYPE
  return config
}

const responseFulfilled = async (response: AxiosResponse) => {
  return response
}

const responseRejected = async (error: AxiosError) => {
  if (error.code === 'ERR_NETWORK') {
    throw new Error('No-API-Found')
  }

  if (error.response?.status == 401) {
    await router.push({ name: 'login' })
    throw new Error('No-Authorized')
  }

  if (error.response?.status == 403) {
    throw new Error('No-Allowed')
  }

  throw new Error((error.response?.data as { message: string }).message)
}

const client: AxiosInstance = axios.create()

client.interceptors.request.use(requestMiddleware)
client.interceptors.response.use(responseFulfilled, responseRejected)

export default client
