import request from '@/utils/request'

export function getList() {
  return request({
    url: '/vision/',
    method: 'get',
  })
}

export function getById(id) {
  return request({
    url: '/vision/'+id,
    method: 'get',
  })
}

export function updateOne(data) {
  return request({
    url: '/vision/',
    method: 'post',
    data: data
  })
}
export function deleteById(id) {
  return request({
    url: '/vision/'+id,
    method: 'delete',
  })
}

export function queryList(p) {
  return request({
    url: '/vision/query',
    method: 'get',
    params: p
  })
}

export function updateBatch(data) {
  return request({
    url: '/vision/batch',
    method: 'post',
    data: data
  })
}

