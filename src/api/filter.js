import request from '@/utils/request'
import axios from 'axios'

export function getList() {
  return request({
    url: '/admin/filter/',
    method: 'get'
  })
}

export function getById(id) {
  return request({
    url: '/admin/filter/' + id,
    method: 'get'
  })
}

export function updateFilter(data) {
  return request({
    url: '/admin/filter/',
    method: 'post',
    data: data
  })
}
export function deleteById(id) {
  return request({
    url: '/admin/filter/' + id,
    method: 'delete'
  })
}

export function publishById(id) {
  return request({
    url: '/admin/filter/publish/' + id,
    method: 'post'
  })
}
export function publishBatch() {
  return request({
    url: '/admin/filter/publish/',
    method: 'post'
  })
}

export function queryList(p) {
  return request({
    url: '/admin/filter/query',
    method: 'get',
    params: p
  })
}

export function inform() {
  return request({
    url: '/admin/filter/publish/inform',
    method: 'get'
  })
}

export function getAvailableTags() {
  return request({
    url: '/admin/filter/tags',
    method: 'get'
  })
}

export function updateBatch(data) {
  return request({
    url: '/admin/filter/batch',
    method: 'post',
    data: data
  })
}
export function getFilterStyle(data) {
  return request({
    url: '/admin/filterStyle',
    method: 'get',
    data: data
  })
}

export function updateFilterStyle(data) {
  return request({
    url: '/admin/filterStyle/',
    method: 'post',
    data: data
  })
}

export function updateOrder(data) {
  return request({
    url: '/admin/filter/order',
    method: 'post',
    data: data
  })
}

export function exportData(data) {
  window.open(request.baseURL + '/admin/filter/export/' + data.id)
}

export async function getBuffer(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data, 'utf-8')
  return buffer
}
