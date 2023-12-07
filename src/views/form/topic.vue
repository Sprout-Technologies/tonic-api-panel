<template>
  <div class="app-container">

    <el-footer style="margin-top:30px">
<!--      <el-button type="primary" @click="featureSubmit">{{this.form.weight && this.form.weight>0.0 ? '取消精选':'精选'}}</el-button>-->
      <el-button type="primary" @click="demoSubmit">设置为{{this.form.videos[0].filter.name}}的演示视频</el-button>
      <el-button type="primary" @click="reRender">重新渲染</el-button>

      <el-button @click="onCancel">返回</el-button>
    </el-footer>

  </div>
</template>

<script>
import { updateOne, getByIdAdmin, feature, demo, reRender } from '@/api/post'
// import {getList as getCategoryList} from "@/api/category"
import { getUploadFileURL, getUploadToken } from '@/api/upload'
const moment = require('moment')

export default {
  created() {
    this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
    this.fetchData(this.id)
  },
  data() {
    return {
      render: false,
      fileList: [],
      loading: true,
      id: null,
      centerDialogVisible: false,
      html: '',
      form: {
        featured: false,
        category: { id: 2 },
        createdAt: Date.now(),
        latest: { title: '', content: '', thumbnail: '', mainVersion: 0, subVersion: 0, published: false, createdAt: Date.now() },
        products: []
      },
      uploadAction: getUploadFileURL(),
      uploadToken: getUploadToken(),
      activeNames: '0',
      products: [],
      categories: []
    }
  },
  // components: { MarkdownEditor, TopicPreview },
  computed: {
    // versionLbl: function () {
    //   let version = '版本号:'+this.form.latest.mainVersion+'.'+this.form.latest.subVersion
    //   let publishStatus = this.form.latest.published ? (' 发布:' + moment(this.form.latest.publishedAt).format(' YYYY-MM-DD HH:mm')):' 未发布'
    //   let saveStatus = this.form.latest.savedAt ? ' 保存:' + moment(this.form.latest.savedAt).format(' YYYY-MM-DD HH:mm') : ''
    //   let createStatus = this.form.latest.createdAt ? ' 创建:' + moment(this.form.latest.createdAt).format(' YYYY-MM-DD HH:mm') : ''
    //
    //   return version+publishStatus +saveStatus+createStatus
    // },

  },
  methods: {

    featureSubmit() {
      feature(this.form.id).then(() => {
        this.$message({
          message: '提交成功!',
          type: 'success'
        })
        this.onCancel()
      }
      )
    },
    demoSubmit() {
      demo(this.form.id).then(() => {
          this.$message({
            message: '提交成功!',
            type: 'success'
          })
          this.onCancel()
        }
      )
    },
    reRender() {
      reRender(this.form.id).then(() => {
          this.$message({
            message: '提交成功!',
            type: 'success'
          })
          this.onCancel()
        }
      )
    },
    handleAvatarSuccess(res, file) {
      this.form.latest.thumbnail = file.response.fileDownloadUri
      this.$forceUpdate()
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.indexOf('image') >= 0

      if (!isJPG) {
        this.$message.error('只能上传图片!')
      }
      return isJPG
    },
    onCancel() {
      this.$router.back(-1)
    },
    onPreview() {

    },
    fetchData(id) {
      this.loading = true
      // getCategoryList().then(res=>{
      //   this.categories = res
      // })
      if (id) {
        getByIdAdmin(id).then(res => {
          this.form = res
          this.loading = false
        })
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style>
  .editor-container{
    position: relative;
    height: 100%;
  }
  .el-tabs__content{
    overflow: unset;
  }
  .previewHtml{
    display: none;
  }

</style>

