import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/filter',
    name: '首屏',
    hidden: true,
    children: [{
      path: 'filter',
      component: () => import('@/views/works/filter')
    }]
  },

  // {
  //   path: '/product',
  //   component: Layout,
  //   redirect: '/product',
  //   name: '产品',
  //   meta: { title: '产品', icon: 'edit' },
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: '产品列表',
  //       component: () => import('@/views/dashboard/product'),
  //       meta: { title: '产品列表', icon: 'guide' }
  //     },
  //     {
  //       path: 'create',
  //       name: '新增产品',
  //       hidden: true,
  //       component: () => import('@/views/form/product'),
  //       meta: { title: '新增产品', icon: 'guide' }
  //     },
  //
  //     {
  //       path: ':id',
  //       name: '产品表单',
  //       hidden: true,
  //
  //       component: () => import('@/views/form/product'),
  //       meta: { title: '产品表单' }
  //     },
  //   ]
  // },
  //
  {
    path: '/styles',
    component: Layout,
    name: 'Styles',
    meta: { title: 'Styles', icon: 'file' },
    children: [
      {
        path: 'stylesEdit',
        name: 'Styles编辑',
        component: () => import('@/views/works/styles'),
        meta: { title: 'Styles', icon: 'guide' }
      }
    ]
  },
  {
    path: '/filter',
    component: Layout,
    redirect: '/filter',
    name: '滤镜',
    meta: { title: '滤镜', icon: 'edit' },
    children: [
      {
        path: 'filterEdit',
        name: '滤镜编辑',
        component: () => import('@/views/works/filter'),
        meta: { title: '滤镜', icon: 'guide' }
      },
      //     {
      //       path: 'vision',
      //       name: '视觉',
      //       component: () => import('@/views/works/vision'),
      //       meta: { title: '视觉', icon: 'guide' }
      //     },
      {
        path: 'filterEdit/:id',
        name: '滤镜表单',
        hidden: true,

        component: () => import('@/views/works/form/filter'),
        meta: { title: '滤镜表单' }
      }

      //     {
      //       path: 'vision/:id',
      //       name: '视觉表单',
      //       hidden: true,
      //
      //       component: () => import('@/views/works/form/vision'),
      //       meta: { title: '视觉表单' }
      //     },
    ]
  },
  // {
  //   path: '/survey',
  //   component: Layout,
  //   redirect: '/survey/surveyEdit',
  //   name: '问卷',
  //   meta: { title: '问卷', icon: 'edit' },
  //   children: [
  //     {
  //       path: 'surveyEdit',
  //       name: '问卷编辑',
  //       component: () => import('@/views/works/survey'),
  //       meta: { title: '问卷列表', icon: 'guide' }
  //     },
  //     {
  //       path: 'surveyEdit/:id',
  //       name: '问卷表单',
  //       hidden: true,
  //
  //       component: () => import('@/views/works/form/survey'),
  //       meta: { title: '问卷表单' }
  //     },
  //     {
  //       path: 'surveyResponse',
  //       name: '答卷编辑',
  //       component: () => import('@/views/works/answer'),
  //       meta: { title: '答卷列表', icon: 'guide' }
  //     },
  //     {
  //       path: 'surveyResponse/:id',
  //       name: '答卷表单',
  //       hidden: true,
  //
  //       component: () => import('@/views/works/form/answer'),
  //       meta: { title: '答卷表单' }
  //     },
  //
  //     //     {
  //     //       path: 'vision/:id',
  //     //       name: '视觉表单',
  //     //       hidden: true,
  //     //
  //     //       component: () => import('@/views/works/form/vision'),
  //     //       meta: { title: '视觉表单' }
  //     //     },
  //   ]
  // },
  {
    path: '/post',
    component: Layout,
    redirect: '/dashboard',
    name: 'Post',
    meta: { title: 'Post&Video', icon: 'edit' },
    children: [
      {
        path: 'dashboard',
        name: 'Posts',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Posts', icon: 'guide' }
      },
      // {
      //   path: 'create',
      //   name: '撰写文章',
      //   hidden: true,
      //   component: () => import('@/views/form/topic'),
      //   meta: { title: '撰写文章', icon: 'guide' }
      // },
      {
        path: ':id',
        name: '文章表单',
        hidden: true,

        component: () => import('@/views/form/topic'),
        meta: { title: '文章表单' }
      }
    ]
  },
  //
  // {
  //   path: '/team',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   name: '团队',
  //   meta: { title: '团队', icon: 'edit' },
  //   children: [
  //     {
  //       path: 'artist',
  //       name: '艺术家',
  //       component: () => import('@/views/team/artist'),
  //       meta: { title: '艺术家', icon: 'guide' }
  //     },
  //     {
  //       path: 'artist/:id',
  //       name: '艺术家表单',
  //       hidden: true,
  //
  //       component: () => import('@/views/team/form/artist'),
  //       meta: { title: '艺术家表单' }
  //     },
  //   ]
  // },
  {
    path: '/basic',
    component: Layout,
    name: '其它',
    redirect: '/basic/category',
    meta: { title: '其它', icon: 'component' },
    children: [
      {
        path: 'category',
        name: '栏目',
        hidden: true,

        component: () => import('@/views/table/category'),
        meta: { title: '栏目' }
      },
      {
        path: 'user',
        name: '管理用户',
        component: () => import('@/views/table/user'),
        meta: { title: '管理用户' }
      },
      {
        path: 'user/:id',
        name: '管理用户表单',
        hidden: true,

        component: () => import('@/views/form/user'),
        meta: { title: '管理用户表单' }
      },
      {
        path: 'category/:id',
        name: '栏目表单',
        hidden: true,

        component: () => import('@/views/form/category'),
        meta: { title: '栏目表单' }
      },
      {
        path: 'event',
        name: '事件信息',
        hidden: false,

        component: () => import('@/views/contents/event'),
        meta: { title: '事件信息' }
      },
      // {
      //   path: 'jobs/:id',
      //   name: '招聘信息表单',
      //   hidden: true,
      //
      //   component: () => import('@/views/contents/form/jobs'),
      //   meta: { title: '招聘信息表单' }
      // },
      {
        path: 'config',
        name: '参数配置',

        component: () => import('@/views/form/config'),
        meta: { title: '参数配置' }
      }
      // {
      //   path: 'backs',
      //   name: '背景设置',
      //
      //   component: () => import('@/views/form/backs'),
      //   meta: { title: '背景设置' }
      // }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

