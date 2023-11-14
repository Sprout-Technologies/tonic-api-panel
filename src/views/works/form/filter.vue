<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="导入测试滤镜">
        <el-button type="primary" @click="handleImportTemplate()" plain>
          <i class="el-icon-files"></i>
          <span>导入测试滤镜（Template)</span>
        </el-button>
      </el-form-item>
      <el-form-item label="滤镜名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="预览图">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :action="uploadAction"
          :headers="uploadToken"
          :on-change="(a,b)=>handlePreviewCoverImageSuccess(a,b)"
        >
          <img v-if="form.preview_cover_image" :src="form.preview_cover_image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="去噪强度">
        <el-input-number size="mini" controls-position="right" :step="1" v-model="form.denoising_strength"></el-input-number>
      </el-form-item>
      <el-form-item label="控制样式">
        <el-checkbox v-model="form.control_style"></el-checkbox>
      </el-form-item>
      <el-form-item label="控制颜色">
        <el-checkbox v-model="form.control_color"></el-checkbox>
      </el-form-item>
      <el-form-item label="开启adetailer">
        <el-checkbox v-model="form.adetailer"></el-checkbox>
      </el-form-item>
      <el-form-item label="勾线方法">
        <el-select v-model="form.extractor" placeholder="选择勾线方法">
          <el-option v-for="(item, key) in feature_extractor" :label="item.module" :value="item.model" :key="key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="样式提取方法">
        <el-select v-model="form.style" placeholder="Styles">
          <el-option v-for="(item, index) in stylesEnum" :label="item.name" :value="item.config" :key="`${item.name}-${index}`"/>
        </el-select>
      </el-form-item>
      <el-form-item label="轮播方式">
        <el-select v-model="form.type" placeholder="选择类别">
          <el-option value="single"></el-option>
          <el-option value="random"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="底模">
        <my-select v-model="form.base_model" :options="base_models" placeholder="选择底模"></my-select>
      </el-form-item>
      <el-form-item label="触发词">
        <el-input v-model="form.trigger_prompt"></el-input>
      </el-form-item>
      <el-form-item label="性别触发词">
        <el-input v-model="form.gender_prompt"></el-input>
      </el-form-item>
      <el-form-item label="TemporalNet">
        <my-select v-model="form.temporalnet" :options="temporalnet" placeholder="选择TemporalNet"></my-select>
      </el-form-item>
      <el-form-item label="Durations">
        <div v-for="(duration, index) in form.durations" :key="index">
          <el-row>
            <el-col :span="4" class="row-spacing">
              <el-form-item label="Start(秒)">
                <el-input-number v-model="duration.startSeconds"></el-input-number>
              </el-form-item>
              <el-form-item label="Start(帧)">
                <el-input-number v-model="duration.startFrames"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="row-spacing">
              <el-form-item label="End(秒)">
                <el-input-number v-model="duration.endSeconds"></el-input-number>
              </el-form-item>
              <el-form-item label="End(帧)">
                <el-input-number v-model="duration.endFrames"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="row-spacing">
              <el-form-item label="Styles">
                <el-select v-model="duration.style" placeholder="Styles">
                  <el-option v-for="(item,index) in stylesEnum" :label="item.name" :value="item.config" :key="item.name+index"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="row-spacing">
              <el-form-item label="Type">
                <el-select v-model="duration.type" placeholder="Type">
                  <el-option label="Random" value="random"></el-option>
                  <el-option label="Single" value="single"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="row-spacing">
              <el-form-item label="Interpolation">
                <el-checkbox v-model="duration.interpolation"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="row-spacing" >
              <el-form-item label="Frame per Style">
                <el-input-number v-model="duration.frame_per_style"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="row-spacing" v-if="duration.outpaint">
              <el-form-item label="Mask Vid">
                <el-input v-model="duration.outpaint.mask_vid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="row-spacing" v-if="duration.outpaint">
              <el-form-item label="Mask Sd">
                <el-input v-model="duration.outpaint.mask_sd"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-button type="text" @click="removeDuration(index)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-button type="text" @click="addDuration">添加 Duration</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveData">{{this.id ? '确认滤镜修改':'确认滤镜创建'}}</el-button>
      </el-form-item>
      <el-form-item label="设置预览">
        <json-viewer :value="form" :expand-depth=5 copyable boxed sort></json-viewer>
      </el-form-item>
    </el-form>
    <el-dialog v-if="showImportModal" title="导入测试滤镜" :visible.sync="showImportModal"   @close="handleDialogClose">
      <el-progress v-if="loading" type="line" :percentage="progressPercentage" :stroke-width="2" />
      <el-scrollbar style="height: 400px;" v-else>
      <el-row v-for="(filter, index) in exampleData" :key="filter" class="filter-item">
        <el-col :span="20">{{ filter.name }}</el-col>
        <el-col :span="4">
          <el-button size="mini" type="primary" @click="importFilter(filter)">导入</el-button>
        </el-col>
      </el-row>
        </el-scrollbar>
    </el-dialog>
  </div>
</template>


<script>
import { getById, updateOne, getFilterStyle } from '@/api/filter'
import { getUploadFileURL, getUploadToken } from '@/api/upload'
import axios from 'axios'
import MySelect from './MySelect.vue'

export default {
  components: {
    MySelect
  },
  created() {
    this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
    this.fetchData(this.id)
    this.fetchStylesEnum()
    if (this.id) {
      this.form.id = this.id
    }
  },

  data() {
    return {
      stylesEnum: [],
      listLoading: false,
      uploadAction: getUploadFileURL(),
      uploadToken: getUploadToken(),
      showImportModal: false,
      exampleData: [],
      loading: false,
      progressPercentage: 0,
      form: {
        name: '',
        denoising_strength: null,
        control_style: false,
        control_color: false,
        adetailer: false,
        extractor: null,
        styler: null,
        type: null,
        base_model: null,
        trigger_prompt: '',
        gender_prompt: '',
        temporalnet: null,
        durations: [],
        preview_cover_image: ''
      },
      base_models: {
        'cetusMix': 'general\\cetusMix_v4.safetensors [b42b09ff12]',
        'dreamshaper': 'new\\dreamshaper_8.safetensors [879db523c3]',
        'revAnimated': 'general\\revAnimated_v122.safetensors [ea1a6218f7]',
        'deliberate': 'general\\deliberate_v2.safetensors [f0406fe1d4]',
        'rundiffusionFX': 'general\\rundiffusionFX_v10.safetensors [ad1a10552b]',
        'rundiffusionFX25D': 'general\\rundiffusionFX25D_v10.safetensors [ad1a10552b]',
        'meinaPastelInpaint': 'general\\meinapastel_v6-inpainting.safetensors',
        'revAnimatedInpaint': 'general\\revAnimated_v121Inp-inpainting.safetensors',
        'dreamShaperInpaint': 'general\\dreamshaper_8Inpainting.safetensors',
        'meinaUnrealInpaint': 'general\\meinaunreal_v41-inpainting.safeFtensors',
        'meinaMixInpaint': 'general\\meinamix_v11-inpainting.safetensors'
      },

      tile: {
        'tile_resample': {
          'module': 'tile_resample',
          'control_mode': 0,
          'model': 'control_v11f1e_sd15_tile [a371b31b]',
          'weight': 0.5
        },
        'tile_colorfix': {
          'module': 'tile_colorfix',
          'control_mode': 0,
          'model': 'control_v11f1e_sd15_tile [a371b31b]',
          'weight': 0.5
        },
        'tile_colorfix+sharp': {
          'module': 'tile_colorfix+sharp',
          'control_mode': 0,
          'model': 'control_v11f1e_sd15_tile [a371b31b]',
          'weight': 0.5
        }

      },

      inpaint: {
        'lama': { 'module': 'inpaint_only+lama', 'control_mode': 0, 'model': 'control_v11p_sd15_inpaint [ebff9138]' },
        'inpaint_only': { 'module': 'inpaint_only', 'control_mode': 0, 'model': 'control_v11p_sd15_inpaint [ebff9138]' },
        'global': { 'module': 'inpaint', 'control_mode': 0, 'model': 'control_v11p_sd15_inpaint [ebff9138]' },
        'global_prompt': { 'module': 'inpaint', 'control_mode': 1, 'model': 'control_v11p_sd15_inpaint [ebff9138]' }

      },

      feature_extractor: {
        'lineart_realistic_prompt': {
          'control_mode': 1,
          'module': 'lineart_realistic',
          'model': 'control_v11p_sd15_lineart [43d4be0d]'
        },
        'lineart_standard_prompt': {
          'control_mode': 1, 'module': 'lineart_standard',
          'model': 'control_v11p_sd15_lineart [43d4be0d]'
        },
        'lineart_realistic': {
          'module': 'lineart_realistic',
          'model': 'control_v11p_sd15_lineart [43d4be0d]'
        },
        'lineart_coarse': { 'module': 'lineart_coarse', 'model': 'control_v11p_sd15_lineart [43d4be0d]' },
        'lineart': { 'module': 'lineart', 'model': 'control_v11p_sd15_lineart [43d4be0d]' },
        'lineart_anime': { 'module': 'lineart_anime', 'model': 'control_v11p_sd15s2_lineart_anime [3825e83e]' },
        'softedge_hedsafe': { 'module': 'softedge_hedsafe', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
        'softedge_hed': { 'module': 'softedge_hed', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
        'softedge_pidinet': { 'module': 'softedge_pidinet', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
        'softedge_pidisafe': { 'module': 'softedge_pidisafe', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
        'depth_zoe': { 'module': 'depth_zoe', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
        'depth_midas': { 'module': 'depth_midas', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
        'depth_leres': { 'module': 'depth_leres', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
        'depth_leres++': { 'module': 'depth_leres++', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
        'canny': { 'module': 'canny', 'model': 'control_v11p_sd15_canny [d14c016b]' },
        'normal_bae': { 'module': 'normal_bae', 'model': 'control_v11p_sd15_normalbae [316696f1]' },
        'segmentation': { 'module': 'segmentation', 'model': 'control_v11p_sd15_seg [e1f51eb9]' },
        't2ia_sketch_pidi': { 'module': 't2ia_sketch_pidi', 'model': 't2iadapter_sketch_sd15v2 [f5789421]' }
      },
      temporalnet: {
        'default': {
          'model': 'diff_control_sd15_temporalnet_fp16 [adc6bd97]',
          'weight': 0.7
        }
      }
    }
  },
  methods: {
    handlePreviewCoverImageSuccess(res, file) {
      if (res.response) {
        this.form.preview_cover_image = res.response.fileDownloadPath
        this.form.icon = res.response.fileDownloadPath
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.indexOf('image') >= 0
      if (!isJPG) {
        this.$message.error('只能上传图片!')
      }
      return isJPG
    },
    addDuration() {
      this.form.durations.push({
        start: 0,
        end: 0,
        startSeconds: 0,
        startFrames: 0,
        endSeconds: 0,
        endFrames: 0,
        style: [],
        type: null,
        interpolation: false,
        frame_per_style: 0,
        outpaint: {
          mask_vid: '',
          mask_sd: ''
        }
      })
    },
    removeDuration(index) {
      this.form.durations.splice(index, 1)
    },
    saveData() {
      const submitData =
        {
          id: this.id || '',
          params: JSON.stringify(this.form)
        }
      console.log(submitData)
      updateOne(submitData).then(response => {
        if (response.success) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.push('/filter')
        } else {
          this.$message.error('保存失败')
        }
      }).catch(error => {
        this.$message.error('保存失败: ' + error)
      })
    },
    handleDialogClose() {
      this.showImportModal = false
    },
    handleImportTemplate() {
      this.showImportModal = !this.showImportModal
      this.loading = true // 设置 loading 为 true
      this.progressPercentage = 0 // 重置进度条的值为0

      const url = 'https://api.jsonsilo.com/public/4eb4bf97-3561-416d-9a69-509f392f96c6'
      const headers = {
        'Content-Type': 'application/json'
      }

      const instance = axios.create()
      instance.defaults.onDownloadProgress = (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.progressPercentage = percentage // 更新进度条的值
      }

      let progress = 0
      const increaseProgress = () => {
        if (progress < 100) {
          progress += 2 // 每次增加2%，可以根据需要调整增加速度
          if (progress > 100) {
            progress = 100 // 确保进度不超过100%
          }
          this.progressPercentage = progress // 更新进度条的值
          setTimeout(increaseProgress, 50) // 每50毫秒增加一次进度，可以根据需要调整增加频率
        } else {
          this.loading = false // 请求完成后，将 loading 设置为 false
        }
      }

      const handleProgress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.progressPercentage = percentage // 更新进度条的值
        }
      }

      instance
        .get(url, { headers: headers, onDownloadProgress: handleProgress })
        .then((response) => {
          this.exampleData = response.data
          console.log(this.exampleData[0], 'test')
        })
        .catch((error) => {
          console.error('There was an error with the request:', error)
        })
        .finally(() => {
          this.loading = false // 请求完成后，将 loading 设置为 false
        })

      setTimeout(increaseProgress, 500) // 从0开始增加进度
    },
    importFilter(filter) {
      // 清空表单数据对象的 durations 数组
      this.form.durations = []
      // 复制滤镜对象的属性
      filter.durations.forEach(duration => {
        // 计算 startSeconds 和 startFrames
        duration.startSeconds = Math.floor(duration.start)
        duration.startFrames = Math.round((duration.start - duration.startSeconds) * 30)

        // 计算 endSeconds 和 endFrames
        duration.endSeconds = Math.floor(duration.end)
        duration.endFrames = Math.round((duration.end - duration.endSeconds) * 30)
      })
      this.form = { ...filter }
    },
    fetchStylesEnum() {
      getFilterStyle().then(res => {
        this.stylesEnum = res.content
      })
    },
    fetchData(id) {
      if (id) {
        this.listLoading = true
        getById(id)
          .then((res) => {
            this.listLoading = false
            if (res['params']) {
              try {
                const paramsObj = JSON.parse(res['params'])
                this.importFilter(paramsObj)
              } catch (e) {
                console.error('解析 params 失败', e)
              }
            }
          })
          .catch((error) => {
            console.error('获取数据失败', error)
          })
      }
    }
  }
}
</script>

<style scoped>
.row-spacing{
  margin-bottom: 20px;
}
.filter-item{
  margin:10px;
  display: flex;
  align-items: center;
}
</style>
