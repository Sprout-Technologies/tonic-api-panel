<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
           <el-form-item label="艺术家（音乐）">
            <el-select multiple allow-create style="width: 100%" class="filter-item" value-key="name" v-model="form.artistsMusic" filterable placeholder="请选择艺术家"  @change="handleArtistsChange">
              <el-option v-for="t in artists.content" :key="t.name" :label="t.name" :value="t">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="艺术家（视觉）">
            <el-select multiple allow-create style="width: 100%" class="filter-item" value-key="name" v-model="form.artistsVision" filterable placeholder="请选择艺术家"  @change="handleArtistsVisionChange">
              <el-option v-for="t in artists.content" :key="t.name" :label="t.name" :value="t">
              </el-option>
            </el-select>
          </el-form-item>
      <el-form-item label="缩略图">

        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="uploadAction"
          :headers="uploadToken"
        >
          <img v-if="form.thumb" :src="form.thumb" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-col :span="12">
          <el-input v-model="form.thumb"></el-input>
        </el-col>
      </el-form-item>
      <!--<el-form-item label="其它配置">-->
      <!--<div class="checkbox checkbox-inline">-->
      <!--<input  type="checkbox" id="display" value="display" v-model="form.display">-->
      <!--<label for="display">显示</label>-->
      <!--</div>-->
      <!--</el-form-item>-->
      <el-form-item label="B站链接">
        <el-input v-model="form.bilibili"></el-input>
      </el-form-item>

      <el-form-item label="U2B链接">
        <el-input v-model="form.youtube"></el-input>
      </el-form-item>
      <el-form-item label="发布日期">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="form.publishedAt"
          type="date"
          placeholder="选择发布日期">
        </el-date-picker>
      </el-form-item>

      <el-col :span="12">
        <el-form-item label="其他设置">
          <el-checkbox v-model="form.hidden">隐藏</el-checkbox>
        </el-form-item>
      </el-col>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{this.id ? '修改':'创建'}}</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { updateOne, getById } from '@/api/vision'
  import { getUploadFileURL, getUploadToken } from '@/api/upload'
import { queryList as queryAristsList } from '@/api/artist'

  export default {
    created() {
      this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
      this.fetchData(this.id)
    },
    data() {
      return {
        artists: [],

        products: [],
        uploadAction: getUploadFileURL(),
        uploadToken: getUploadToken(),
        listLoading: false,
        form: {
          name: '',
          publishedAt: new Date(),
          artistsMusic: [],
          artistsVision: []
        }
      }
    },

    methods: {
      handleArtistsChange(val) {
        const newVal = this.form.artistsMusic[this.form.artistsMusic.length - 1]
        const str = typeof newVal === 'object' ? newVal.name : newVal
        this.form.artistsMusic = this.form.artistsMusic.filter((artists, index) => { if (index >= this.form.artists.length - 1) return true; if (typeof artists === 'string') return artists !== str; else return artists.name !== str })
      },
      handleArtistsVisionChange(val) {
        const newVal = this.form.artistsVision[this.form.artistsVision.length - 1]
        const str = typeof newVal === 'object' ? newVal.name : newVal
        this.form.artistsVision = this.form.artistsVision.filter((artists, index) => { if (index >= this.form.artists.length - 1) return true; if (typeof artists === 'string') return artists !== str; else return artists.name !== str })
      },
      onSubmit() {
        this.form.artistsMusic = this.form.artistsMusic.map(product => {
          if (typeof product === 'string') {
            return {
              name: product
            }
          } else {
            return product
          }
        })
        this.form.artistsVision = this.form.artistsVision.map(product => {
          if (typeof product === 'string') {
            return {
              name: product
            }
          } else {
            return product
          }
        })
        updateOne(this.form).then(() => this.onCancel())
      },
      reset() {
        this.form = {
          tag: { id: null }
        }
      },
      onCancel() {
        this.$router.back(-1)
      },
      fetchData(id) {
        queryAristsList({ size: 99999 }).then(res => this.artists = res)

        if (id) {
          this.listLoading = true
          getById(id).then(res => { this.listLoading = false; this.form = res })
        }
      },
      handleAvatarSuccess(res, file) {
        this.form.thumb = file.response.fileDownloadUri
        this.$forceUpdate()
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type.indexOf('image') >= 0

        if (!isJPG) {
          this.$message.error('只能上传图片!')
        }

        return isJPG
      }
    }
  }
</script>

<style scoped>
  .line{
    text-align: center;
  }
</style>

