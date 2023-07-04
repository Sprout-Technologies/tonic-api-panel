import request from '@/utils/request'

export function getList() {
  return request({
    url: '/admin/post/',
    method: 'get',
  })
}

export function queryList(p) {
  return request({
    url: '/admin/post/query',
    method: 'get',
    params: p
  })
}


export function getById(id) {
  return request({
    url: '/admin/post/'+id,
    method: 'get',
  })
}

export function getByIdAdmin(id) {
  return request({
    url: '/admin/post/'+id,
    method: 'get',
  })
}

export function deleteById(id) {
  return request({
    url: '/admin/post/'+id,
    method: 'delete',
  })
}

export function updateOne(data) {
  return request({
    url: '/admin/post/',
    method: 'post',
    data: data
  })
}

export function publish(id) {
  return request({
    url: '/admin/post/publish/'+id,
    method: 'get',
  })
}

export function updateBatch(data) {
  return request({
    url: '/admin/post/batch',
    method: 'post',
    data: data
  })
}
