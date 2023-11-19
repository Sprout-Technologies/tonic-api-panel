<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="上线状态">
        <el-select v-model="form.visibilityStatus" placeholder="上线状态">
          <el-option v-for="(item, key) in visibilityStatusEnum" :key="key" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="滤镜名">
        <el-input v-model="form.songName"/>
      </el-form-item>
      <el-form-item label="艺术家名">
        <el-input v-model="form.artistName"/>
      </el-form-item>
      <el-form-item label="展示名称">
        <el-input v-model="form.name" disabled/>
      </el-form-item>
      <el-form-item label="时长(展示)">
        <el-input-number
          v-model="form.duration"
          :min="1"
          :max="3600"
          step="1"
          controls-position="right">
        </el-input-number>
      </el-form-item>
      <el-form-item label="时长(真实)">
        <el-input-number
          v-model="form.exDuration"
          :min="1"
          :max="3600"
          controls-position="right">
        </el-input-number>
      </el-form-item>
      <el-form-item label="是否新滤镜">
        <el-checkbox v-model="form.newFilter"/>
      </el-form-item>
      <el-form-item label="popular">
        <el-checkbox v-model="form.popular"/>
      </el-form-item>
      <el-form-item label="trendingTiktok">
        <el-checkbox v-model="form.trendingTiktok"/>
      </el-form-item>
      <el-form-item label="trendicngInstagram">
        <el-checkbox v-model="form.trendingInstagram"/>
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
          <img v-if="form.previewCoverImage" :src="form.previewCoverImage" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="图标">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :action="uploadAction"
          :headers="uploadToken"
          :on-success="handleIconSuccess"
        >
          <img v-if="form.icon" :src="form.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="预览视频">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="uploadAction"
          :headers="uploadToken"
          :on-success="handleVideoSuccess"
        >
          <video v-if="form.previewVideo" :src="form.previewVideo" controls class="video-preview"></video>
          <i v-else class="el-icon-plus avatar-uploader-icon">
            上传视频
          </i>
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
        <el-select v-model="form.extractorKey" placeholder="选择勾线方法">
          <el-option v-for="(item, key) in feature_extractor" :label="key" :value="key" :key="key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="样式提取方法">
        <el-select v-model="form.stylerKey" placeholder="Stylers">
          <el-option v-for="(item, key, index) in stylers" :label="key" :value="key" :key="`${key}-${index}`"/>
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
            <el-form-item label="Styles">
              <el-col :span="8" class="row-spacing">
                <el-select
                  v-model="duration.style"
                  filterable
                  placeholder="Styles"
                >
                  <el-option
                    v-for="(style, index) in stylesEnum"
                    :label="style.name + '--'+ index"
                    :value="style.stringValue"
                    :key="style.id"
                  />
                </el-select>
              </el-col>
              </el-form-item>
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
import { getById, getFilterStyle, updateFilter } from '@/api/filter'
import { getUploadFileURL, getUploadToken } from '@/api/upload'
import axios from 'axios'
import MySelect from './MySelect.vue'

export default {
  components: {
    MySelect
  },
  async created() {
    this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
    if (this.id) {
      this.form.id = this.id
    }
    await this.fetchStylesEnum()
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
        stylerKey: '',
        extractorKey: '',
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
        exDuration: 0
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
      },
      stylers: {
        't2ia_style_clipvision': { 'module': 't2ia_style_clipvision', 'model': 't2iadapter_style_sd14v1 [202e85cc]' },
        'shuffle': { 'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 1.0, 'start': 0.0, 'end': 1 },
        'shuffle_weight15': { 'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 0.15, 'start': 0.0,
          'end': 1 },
        'shuffle_mode2': { 'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 1.0, 'start': 0.0,
          'end': 1, 'control_mode': 2 }

      },
      visibilityStatusEnum: [
        { value: 0, label: '隐藏' },
        { value: 1, label: '上线' },
        { value: 2, label: '测试' }
      ]
    }
  },
  methods: {
    handlePreviewCoverImageSuccess(res, file) {
      if (res.response) {
        this.form.previewCoverImage = res.response.fileDownloadPath
        this.$forceUpdate()
      }
    },
    handleIconSuccess(res, file) {
      this.form.icon = res.fileDownloadPath
      this.$forceUpdate()
    },
    handleVideoSuccess(res, file) {
      this.form.previewVideo = res.fileDownloadPath
      this.$forceUpdate()
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
        styler: [],
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
      // 从 this.form 创建 submitData 的副本
      const submitData = JSON.parse(JSON.stringify(this.form))
      delete submitData.params
      // 将字符串转换回对象
      // 处理 styler
      if (submitData.stylerKey && this.stylers[submitData.stylerKey]) {
        submitData.styler = this.stylers[submitData.stylerKey]
      }

      // 处理 extractor
      if (submitData.extractorKey && this.feature_extractor[submitData.extractorKey]) {
        submitData.extractor = this.feature_extractor[submitData.extractorKey]
      }
      if (submitData.durations) {
        submitData.durations.forEach(duration => {
          const tempObj = JSON.parse(duration.style)
          duration.style = [tempObj]
        })
      }
      if (this.form.exDuration) {
        submitData.duration = this.form.exDuration
      }
      // 创建最终提交数据对象
      const finalData = {
        id: submitData.id || this.id,
        icon: submitData.icon,
        previewCoverImage: submitData.previewCoverImage,
        previewVideo: submitData.previewVideo,
        songName: submitData.songName,
        artistName: submitData.artistName,
        name: submitData.name,
        duration: this.form.duration,
        newFilter: submitData.newFilter,
        popular: submitData.popular,
        trendingTiktok: submitData.trendingTiktok,
        trendingInstagram: submitData.trendingInstagram,
        visibilityStatus: submitData.visibilityStatus,
        revision: submitData.revision,
        updatedAt: submitData.updatedAt,
        weight: submitData.weight,
        createdAt: submitData.createdAt,
        // 可能还有其他需要添加的字段...
        params: JSON.stringify(submitData)
      }
      delete submitData.id
      delete submitData.icon
      delete submitData.previewCoverImage
      delete submitData.previewVideo
      delete submitData.songName
      delete submitData.artistName
      delete submitData.name
      delete submitData.newFilter
      delete submitData.popular
      delete submitData.trendingTiktok
      delete submitData.trendingInstagram
      delete submitData.visibilityStatus
      delete submitData.revision
      delete submitData.updatedAt
      delete submitData.weight
      delete submitData.createdAt
      delete submitData.exDuration
      finalData.params = JSON.stringify(submitData)
      console.log(finalData, 'finalData')
      updateFilter(finalData).then(response => {
        if (response.status === 200) {
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
    importFilter(filter, res) {
      // 使用 JSON 方法进行深拷贝
      const deepCopiedFilter = JSON.parse(JSON.stringify(filter))

      // 处理 deepCopiedFilter 的属性
      deepCopiedFilter.durations.forEach(duration => {
        // 计算 startSeconds 和 startFrames
        duration.startSeconds = Math.floor(duration.start)
        duration.startFrames = Math.round((duration.start - duration.startSeconds) * 30)

        // 计算 endSeconds 和 endFrames
        duration.endSeconds = Math.floor(duration.end)
        duration.endFrames = Math.round((duration.end - duration.endSeconds) * 30)
        if (duration.style) {
          duration.style = JSON.stringify(...duration.style)
        }
      })

      // 更新 form 数据
      this.form = {
        // 新增或修改的属性
        artistName: res.artistName,
        songName: res.songName,
        newFilter: res.newFilter,
        trendingInstagram: res.trendingInstagram,
        trendingTiktok: res.trendingTiktok,
        popular: res.popular,
        revision: res.revision,
        weight: res.weight,
        duration: res.duration,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        id: res.id,
        icon: res.icon,
        previewCoverImage: res.previewCoverImage,
        previewVideo: res.previewVideo,
        name: res.name,
        visibilityStatus: res.visibilityStatus,
        // 已有的属性
        ...deepCopiedFilter
      }
      // 时长(真实)是在filter的params里面的，所以需要单独处理。
      this.form.duration = res.duration
      console.log(res.duration, 'res.duration')
      this.form.exDuration = deepCopiedFilter.duration
      console.log(deepCopiedFilter, 'this.form')
      this.$forceUpdate()
    },
    async fetchStylesEnum() {
      getFilterStyle().then(res => {
        this.stylesEnum = res.content.map(style => ({
          id: style.id,
          name: style.name,
          stringValue: style.config // 假设 id 是唯一标识符
        }))
        this.fetchData(this.id)
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
                this.importFilter(paramsObj, res)
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
