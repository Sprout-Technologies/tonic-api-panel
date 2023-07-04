import request from '@/utils/request'
import { getToken } from '@/utils/auth'
export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getUploadFileURL() {
  return request.baseURL + 'upload/admin/'
}

export function getImportFileURL() {
  return request.baseURL + 'filter/import/'
}

export function getUploadToken() {
  if(!request.token){
    return {'X-Authorization':'Bearer '+getToken()}
  }
  return {'X-Authorization':'Bearer '+request.token}
}

