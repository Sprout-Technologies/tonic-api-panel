import request from '@/utils/request'

export function getList() {
  return request({
    url: '/config/',
    method: 'get'
  })
}

export function getById(id) {
  return request({
    url: '/config/' + id,
    method: 'get'
  })
}

export function updateOne(data) {
  return request({
    url: '/config/',
    method: 'post',
    data: data
  })
}

export function updateBatch(data) {
  return request({
    url: '/config/batch',
    method: 'post',
    data: data
  })
}

export function deleteById(id) {
  return request({
    url: '/config/' + id,
    method: 'delete'
  })
}

export function queryList(p) {
  return request({
    url: '/config/query',
    method: 'get',
    params: p
  })
}
