import request from '@/utils/request'
import axios from "axios";

export function getList() {
  return request({
    url: '/survey/',
    method: 'get',
  })
}
export function getAnswers() {
  return request({
    url: '/survey/answers/',
    method: 'get',
  })
}

export function getAnswer(id) {
  return request({
    url: '/survey/answer/'+id,
    method: 'get',
  })
}
export function getById(id) {
  return request({
    url: '/survey/'+id,
    method: 'get',
  })
}

export function updateOne(data) {
  return request({
    url: '/survey/',
    method: 'post',
    data: data
  })
}
export function deleteById(id) {
  return request({
    url: '/survey/'+id,
    method: 'delete',
  })
}

export function publishBatch() {
  return request({
    url: '/survey/publish/',
    method: 'post',
  })
}

export function queryList(p) {
  return request({
    url: '/survey/query',
    method: 'get',
    params: p
  })
}

export function updateBatch(data) {
  return request({
    url: '/survey/batch',
    method: 'post',
    data: data
  })
}


export function publishById(data) {
  return request({
    url: '/survey/publish/'+data,
    method: 'get'
  })
}

export function open() {
  return request({
    url: '/survey/open/',
    method: 'get'
  })
}

export function close() {
  return request({
    url: '/survey/close/',
    method: 'get'
  })
}
