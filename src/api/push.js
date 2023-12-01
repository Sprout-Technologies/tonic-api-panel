import request from '@/utils/request'

export function getAllPush() {
  return request({
    url: '/admin/push/',
    method: 'get'
  })
}
export function getPushDetail(id) {
  return request({
    url: `/admin/push/${id}`,
    method: 'get'
  })
}
export function updatePush(data) {
  return request({
    url: '/admin/push/',
    method: 'post',
    data: data
  })
}

export function confirmPush(data) {
  return request({
    url: '/admin/push/generic',
    method: 'post',
    data: data
  })
}

export function testPush(data) {
  return request({
    url: '/admin/push/generic/test',
    method: 'post',
    data: data
  })
}
