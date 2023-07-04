import request from '@/utils/request'

export function getList() {
  return request({
    url: '/artist/',
    method: 'get',
  })
}

export function getById(id) {
  return request({
    url: '/artist/'+id,
    method: 'get',
  })
}

export function updateOne(data) {
  return request({
    url: '/artist/',
    method: 'post',
    data: data
  })
}

export function updateBatch(data) {
  return request({
    url: '/artist/batch',
    method: 'post',
    data: data
  })
}

export function deleteById(id) {
  return request({
    url: '/artist/'+id,
    method: 'delete',
  })
}

export function queryList(p) {
  return request({
    url: '/artist/query',
    method: 'get',
    params: p
  })
}
