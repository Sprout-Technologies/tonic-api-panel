import request from '@/utils/request'

export function getList() {
  return request({
    url: '/event/',
    method: 'get'
  })
}

export function getById(id) {
  return request({
    url: '/event/' + id,
    method: 'get'
  })
}

export function approve(id, reject) {
  return request({
    url: '/event/' + id + '/passed/' + reject,
    method: 'get'
  })
}

export function updateOne(data) {
  return request({
    url: '/event/',
    method: 'post',
    data: data
  })
}

export function deleteById(id) {
  return request({
    url: '/event/' + id,
    method: 'delete'
  })
}

export function queryList(p) {
  return request({
    url: '/event/query',
    method: 'get',
    params: p
  })
}
export function updateBatch(data) {
  return request({
    url: '/event/batch',
    method: 'post',
    data: data
  })
}
