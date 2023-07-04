import request from '@/utils/request'

export function getList() {
  return request({
    url: '/admin/user/',
    method: 'get',
  })
}

export function queryList(p) {
  return request({
    url: '/admin/user/query',
    method: 'get',
    params: p
  })
}

export function adminList() {
  return queryList({role:99})
}


export function getById(id) {
  return request({
    url: '/admin/user/'+id,
    method: 'get',
  })
}

export function deleteById(id) {
  return request({
    url: '/admin/user/'+id,
    method: 'delete',
  })
}

export function updateOne(data) {
  return request({
    url: '/admin/user/',
    method: 'post',
    data: data
  })
}
