<template>
  <div class="app-container">


    <el-tabs  stretch v-model="activeNames">
      <el-tab-pane label="基础数据" name="0">
        <el-form ref="form" :model="form" label-width="120px">

<!--          <h3>全局属性</h3>-->
          <!--<el-form-item label="URL别名">-->
            <!--<el-input width="200" placeholder="URL别名" v-model="form.name"></el-input>-->
          <!--</el-form-item>-->
          <el-row>
            <!--<el-col :span="12">-->
              <!--<el-form-item label="文章类型">-->
                <!--<el-select style="width: 200px" class="filter-item" v-model="form.category" value-key="id" filterable placeholder="请选择栏目">-->
                  <!--<el-option v-for="c in categories.content" :key="c.id" :label="c.name" :value="c">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <el-form-item label="创建日期">
              <el-date-picker
                v-model="form.createdAt"
                type="date"
                placeholder="选择创建日期">
              </el-date-picker>
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="其他设置">
                <el-checkbox v-model="form.hidden">隐藏</el-checkbox>
<!--                <el-checkbox v-model="form.featured">置顶</el-checkbox>-->
              </el-form-item>
            </el-col>


          </el-row>



<!--          <h3>版本属性</h3>-->
<!---->

              <el-form-item label="缩略图">

                    <el-upload
                      class="avatar-uploader"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                      :action="uploadAction"
                      :headers="uploadToken"
                    >
                      <img v-if="form.stickers[0].url" :src="form.stickers[0].url" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                <el-col :span="12">
                  <el-input v-model="form.stickers[0].url"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="caption">
                <el-input v-model="form.captions[0].content"  type="textarea" autosize></el-input>
              </el-form-item>
          <el-row>


          </el-row>
          <el-footer style="margin-top:30px">
            <el-button disabled="" type="primary" @click="onSubmit">{{id ? '修改':'创建'}}</el-button>
            <el-button @click="onCancel">返回</el-button>
          </el-footer>
        </el-form>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>　
import {updateOne, getByIdAdmin} from "@/api/post"
// import {getList as getCategoryList} from "@/api/category"
import {getUploadFileURL, getUploadToken} from '@/api/upload'
const moment = require('moment')

export default {
  created() {
    this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
    this.fetchData(this.id)
  },
  data() {
    return {
      render:false,
      fileList:[],
      loading:true,
      id:null,
      centerDialogVisible: false,
      html: '',
      form: {
        featured:false,
        category:{id:2},
        createdAt:Date.now(),
        latest:{title:'',content: '',thumbnail:'',mainVersion:0,subVersion:0,published:false,createdAt:Date.now()},
        products:[]
      },
      uploadAction: getUploadFileURL(),
      uploadToken:getUploadToken(),
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

    onSubmit() {
      // if(this.form.products) {
      //   this.form.products = this.form.products.map(product => {
      //     if (typeof product === 'string') {
      //       return {
      //         name: product,
      //       }
      //     } else {
      //       return product
      //     }
      //   });
      // }
      updateOne(this.form).then(()=>{
          this.$message({
            message: '提交成功!',
            type: 'success'
          })
          this.onCancel()
        }
      )
    },
    handleAvatarSuccess(res, file) {
      this.form.latest.thumbnail = file.response.fileDownloadUri;
      this.$forceUpdate()

    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.indexOf('image')>=0;

      if (!isJPG) {
        this.$message.error('只能上传图片!');
      }
      return isJPG;
    },
    onCancel() {
      this.$router.back(-1)
    },
    onPreview(){

    },
    fetchData(id) {
      this.loading = true
      // getCategoryList().then(res=>{
      //   this.categories = res
      // })
      if(id) {
        getByIdAdmin(id).then(res => {
          this.form = res;
          this.loading = false
        })
      }
      else{
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

