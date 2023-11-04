import request from '@/utils/request'
import axios from 'axios'

export function getList() {
  return request({
    url: '/filter/',
    method: 'get'
  })
}

export function getById(id) {
  return request({
    url: '/filter/' + id,
    method: 'get'
  })
}

export function updateOne(data) {
  return request({
    url: '/filter/',
    method: 'post',
    data: data
  })
}
export function deleteById(id) {
  return request({
    url: '/filter/' + id,
    method: 'delete'
  })
}

export function publishById(id) {
  return request({
    url: '/filter/publish/' + id,
    method: 'post'
  })
}
export function publishBatch() {
  return request({
    url: '/filter/publish/',
    method: 'post'
  })
}

export function queryList(p) {
  return request({
    url: '/filter/query',
    method: 'get',
    params: p
  })
}

export function inform() {
  return request({
    url: '/filter/publish/inform',
    method: 'get'
  })
}

export function getAvailableTags() {
  return request({
    url: '/filter/tags',
    method: 'get'
  })
}

export function updateBatch(data) {
  return request({
    url: '/filter/batch',
    method: 'post',
    data: data
  })
}
export function getFilterStyle(data) {
  return request({
    url: '/filterStyle',
    method: 'get',
    data: data
  })
}

export function exportData(data) {
  window.open(request.baseURL + 'filter/export/' + data.id)
}

export async function getBuffer(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data, 'utf-8')
  return buffer
}
