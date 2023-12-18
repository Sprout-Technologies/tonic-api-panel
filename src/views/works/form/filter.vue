<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="从现有滤镜复制" v-if="!form.id">
        <el-button @click="handleImportTemplate()">导入滤镜</el-button>
      </el-form-item>
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
      <el-form-item label="展示名称(这个名称将被展示在APP/滤镜列表中)">
        <el-input v-model="form.name"/>
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
          :data="{ path: 'icon' }"
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
          :data="{ path: 'preview_video' }"
          :on-success="handleVideoSuccess"
        >
          <video v-if="form.previewVideo" :src="form.previewVideo" controls class="video-preview"></video>
          <i v-else class="el-icon-plus avatar-uploader-icon">
            上传视频
          </i>
        </el-upload>
      </el-form-item>
      <el-form-item label="音乐">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="uploadAction"
          :headers="uploadToken"
          :data="{ path: 'bgm' }"
          :on-success="handleMusicSuccess"
        >
          <video v-if="form.music" :src="form.music" controls class="video-preview"></video>
          <i v-else class="el-icon-plus avatar-uploader-icon">
            上传音乐
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
      <el-form-item label="触发词(暂不需要）">
        <el-input v-model="form.trigger_prompt" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别触发词">
        <el-input v-model="form.gender_prompt"></el-input>
      </el-form-item>
      <el-form-item label="neg_prompt">
        <el-input v-model="form.neg_prompt"></el-input>
      </el-form-item>
      <el-form-item label="TemporalNet" disabled>
        <my-select v-model="form.temporalnet" :options="temporalnet" placeholder="选择TemporalNet"></my-select>
      </el-form-item>
      <el-form-item label="Use Animatediff" disabled>
        <el-checkbox v-model="animatediff" @change="handleAnimatediffChange"></el-checkbox>
        <el-select v-model="selectedModel" placeholder="请选择模型" v-if="animatediff">
          <el-option v-for="model in models" :key="model" :label="model" :value="model"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Durations">
        <div v-for="(duration, index) in form.durations" :key="index">
          <el-row>
              <el-form-item label="Start(秒)" style="width: 260px">
                <el-input v-model="duration.startSeconds"></el-input>
              </el-form-item>
              <el-form-item label="Start(帧)" style="width: 260px">
                <el-input v-model="duration.startFrames"></el-input>
              </el-form-item>
              <el-form-item label="End(秒)" style="width: 260px">
                <el-input v-model="duration.endSeconds"></el-input>
              </el-form-item>
              <el-form-item label="End(帧)" style="width: 260px">
                <el-input v-model="duration.endFrames"></el-input>
              </el-form-item>
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
            <el-col :span="4" class="row-spacing" >
              <el-form-item>
                <el-button @click="copyDuration(duration)">复制该Duration</el-button>
              </el-form-item>
            </el-col>
<!--            <el-col :span="8" class="row-spacing" v-if="duration.outpaint">
              <el-form-item label="Mask Vid">
                <el-input v-model="duration.outpaint.mask_vid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="row-spacing" v-if="duration.outpaint">
              <el-form-item label="Mask Sd">
                <el-input v-model="duration.outpaint.mask_sd"></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :span="24">
              <el-button type="text" @click="removeDuration(index)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-button type="text" @click="addDuration">添加 Duration</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="videoPreview">上传视频并预览</el-button>
        <el-button type="primary" @click="saveData">{{this.id ? '确认滤镜修改':'确认滤镜创建'}}</el-button>
      </el-form-item>
      <el-form-item label="设置预览">
        <json-viewer :value="form" :expand-depth=5 copyable boxed sort></json-viewer>
      </el-form-item>
    </el-form>
    <el-dialog title="导入现有滤镜(滤镜名/最后更新时间)" :visible.sync="showImportModal"   @close="handleDialogClose" >
      <el-row v-for="(res, index) in exampleData" :key="res" class="filter-item">
        <el-col :span="20" >{{ res.name }}</el-col>
        <el-col :span="20">{{ formatTimestamp(res.updatedAt) || '无更新时间'}}</el-col>
        <el-col :span="4">
          <el-button size="mini" type="primary" @click="importFilter(undefined,res)">导入</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog   title="预览渲染效果" :visible.sync="previewDialog"   @close="handleDialogClose">
      <div>注意,此处的预览为了减少渲染时间，只会渲染每一个区间的第一帧,快速预览效果。完整渲染需要的时间会比较久。并且由于渲染结果随机，仅供预览使用，不代表最终效果。</div>
      <el-form>
        <el-form-item label="上传视频:">
          <div style="display: flex">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :action="uploadAction"
              :headers="uploadToken"
              :on-success="handleResultVideoSuccess">
              <video v-if="resultVideo" :src="resultVideo" controls class="result-video-preview" id="result-video"></video>
              <i v-else class="el-icon-plus avatar-uploader-icon">
                上传视频
              </i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="预览:">
          <el-button @click="confirmPreview">STEP1:确认视频并抽帧预览(1秒30帧，请勿配置错误.仅抽开始第一帧)</el-button>
          <el-button v-if="!isStartPrint" @click="startPrint">STEP2:开始渲染(请勿重复点击，点击后Fail的图片占位会变成渲染后图片，需要3-5分钟完全渲染)</el-button>
          <el-button disabled v-else>渲染中</el-button>
          <div class="preview-area">
            <div class="single-preview" v-for="(duration,index) in this.form.durations" v-if="videoImage.length>0">
              <div class="single-preview-title">
                第 {{duration.startSeconds}} 秒 第 {{duration.startFrames}} 帧
              </div>
              <div class="single-preview-result">
                <div class="single-preview">
                <el-image :preview-src-list="videoImage[index]" :src="videoImage[index]" class="result-image-preview"/>
                <!-- 箭头图标 -->
                <i class="el-icon-arrow-right arrow-icon"></i>
                  <el-image :preview-src-list="videoImagePreview[index]" :src="videoImagePreview[index]" class="result-image-preview"/>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
import { getById, getFilterStyle, queryList, updateFilter } from '@/api/filter'
import { getUploadFileURL, getUploadToken } from '@/api/upload'
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
      music: '',
      resultVideo: '',
      previewDialog: false,
      videoImage: [],
      videoURLImage: [],
      videoImagePreview: [],
      isStartPrint: false,
      form: {
        artistName: '',
        songName: '',
        newFilter: false,
        trendingInstagram: false,
        trendingTiktok: false,
        popular: false,
        revision: 0,
        weight: 0,
        duration: 10,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        icon: '',
        previewCoverImage: '',
        previewVideo: '',
        visibilityStatus: 0,
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
        neg_prompt: '',
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
        '无': {},
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
        '无': {},
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
        '无': {},
        'ipadapter_0.1': { 'module': 'ip-adapter_clip_sd15', 'model': 'ip-adapter_sd15 [6a3f6166]', 'weight': 0.1 },
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
      ],
      animatediff: null,
      selectedModel: '',
      models: [
        'mm_sd_v14.ckpt',
        'animatediffMotion_v14.ckpt',
        'animatediffMotion_sdxlV10Beta.ckpt',
        'mm_sd_v15_v2.ckpt',
        'mm_sdxl_v10_beta.ckpt',
        'temporaldiff-v1-animatediff.safetensors',
        'hsxl_temporal_layers.f16.safetensors',
        'mm-Stabilized_mid.pth',
        'mm-Stabilized_high.pth'
      ]
    }
  },
  methods: {
    videoPreview() {
      this.previewDialog = true
    },

    // 处理上传成功
    async  uploadBlob(blob, style) {
      const file = new File([blob], 'image.png', { type: blob.type })
      const formData = new FormData()

      formData.append('file', file)
      formData.append('path', 'style_ref')
      const uploadURL = getUploadFileURL()
      const response = await fetch(uploadURL, {
        method: 'POST',
        body: formData,
        headers: getUploadToken()
      })
      const { fileDownloadPath, fileName } = await response.json()
      const styleName = JSON.parse(style).name
      this.videoURLImage.push(
        {
          fileName: fileName,
          file: fileDownloadPath,
          style: style,
          styleName: styleName
        })
    },
    async copyDuration(duration) {
      this.form.durations.push(JSON.parse(JSON.stringify(duration)))
    },
    async confirmPreview() {
      this.videoImage = []
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      video.setAttribute('crossOrigin', 'anonymous')
      video.src = this.resultVideo

      video.onloadedmetadata = async() => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        try {
          for (const duration of this.form.durations) {
            const timeInSeconds = Number(duration.startSeconds) + (Number(duration.startFrames) / 30)
            video.currentTime = timeInSeconds

            await new Promise(resolve => {
              video.onseeked = () => {
                resolve() // 确保视频跳转到指定时间点
              }
            })

            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
            await new Promise(resolve => {
              canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob)
                this.videoImage.push(url)
                this.uploadBlob(blob, duration.style)
                resolve()
              })
            })
          }
        } catch (error) {
          console.error('Error during video processing:', error)
        } finally {
          video.remove()
          canvas.remove()
        }
      }

      video.load() // 确保视频加载
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', { hour12: false })
    },
    handlePreviewCoverImageSuccess(res, file) {
      if (res.response) {
        this.form.previewCoverImage = res.response.fileDownloadPath
        this.$forceUpdate()
      }
    },
    handleIconSuccess(res, file) {
      if (res.fileDownloadPath) {
        this.form.icon = res.fileDownloadPath.replace(
          /^https:\/\/sprout-tonic-app.*?\/public\//,
          'https://dkfyqdved0mrm.cloudfront.net/public/'
        )
      }
      this.$forceUpdate()
    },
    async startPrint() {
      if (this.videoURLImage.length === 0) {
        this.$message.error('请先上传视频并切分帧')
        return
      }

      // 定义请求 URL
      const previewURL = 'https://u201483-b96f-7fef9ade.westx.seetacloud.com:8443/img/preview'
      this.isStartPrint = true
      for (const item of this.videoURLImage) {
        try {
          // 发送 POST 请求
          const response = await fetch(previewURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              files: [`style_ref/${item.fileName}`], // file 是一个只包含一个元素的数组
              style: JSON.parse(item.style)
            })
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const responseData = await response.json()
          this.videoImagePreview.push(responseData[0])
          if (this.videoImagePreview.length === this.videoURLImage.length) {
            this.isStartPrint = false
          }
          // 在这里处理每个请求的响应
        } catch (error) {
          console.error('请求失败:', error)
          // 在这里处理请求错误
        }
      }
    },
    handleVideoSuccess(res, file) {
      this.form.previewVideo = res.fileDownloadPath.replace(
        /^https:\/\/sprout-tonic-app.*?\/public\//,
        'https://dkfyqdved0mrm.cloudfront.net/public/'
      )
      this.$forceUpdate()
    },
    handleResultVideoSuccess(res, file) {
      this.resultVideo = res.fileDownloadPath
      this.$forceUpdate()
    },
    handleMusicSuccess(res, file) {
      this.form.music = res.fileDownloadPath.replace(
        /^https:\/\/sprout-tonic-app.*?\/public\//,
        'https://dkfyqdved0mrm.cloudfront.net/public/'
      )
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
        style: [],
        type: null,
        interpolation: false,
        frame_per_style: 2
        /*    outpaint: {
          mask_vid: '',
          mask_sd: ''
        }*/
      })
    },
    removeDuration(index) {
      this.form.durations.splice(index, 1)
    },
    handleAnimatediffChange(value) {
      if (value) {
        // 如果没有默认模型，则选择第一个
        this.selectedModel = this.models.length > 0 ? this.models[0] : ''
        this.form.animatediff = { model: this.selectedModel }
      } else {
        this.selectedModel = ''
        this.form.animatediff = null
      }
    },
    saveData() {
      // 从 this.form 创建 submitData 的副本
      const submitData = JSON.parse(JSON.stringify(this.form))
      delete submitData.params
      // 将字符串转换回对象
      if (this.animatediff) {
        submitData.animatediff = {
          model: this.selectedModel
        }
      }
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
          console.log(duration.startSeconds, duration.startFrames)
          duration.start = Number(duration.startSeconds) + (Number(duration.startFrames) / 30)
          duration.end = Number(duration.endSeconds) + (Number(duration.endFrames) / 30)
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
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$router.push('/filter')
      }).catch(error => {
        this.$message.error('保存失败: ' + error)
      })
    },
    handleDialogClose() {
      this.showImportModal = false
      this.previewDialog = false
    },
    handleImportTemplate() {
      this.showImportModal = !this.showImportModal
      queryList({
        size: 99999,
        page: 0,
        sort: ['weight,asc', 'updatedAt,desc']
      }).then(res => {
        this.exampleData = res.content
      })
    },
    importFilter(filter, res) {
      let isCreateAndImport = false
      if (!filter) {
        filter = JSON.parse(res.params)
        isCreateAndImport = true
      }
      // 使用 JSON 方法进行深拷贝
      const deepCopiedFilter = JSON.parse(JSON.stringify(filter))
      // 初始化selectedModel和animatediff
      this.selectedModel = ''
      this.animatediff = false

      // 处理 deepCopiedFilter 的属性
      deepCopiedFilter.durations.forEach(duration => {
        // 计算 startSeconds 和 startFrames
        duration.startSeconds = Math.floor(duration.start)
        duration.startFrames = Math.round((duration.start - duration.startSeconds) * 30)

        // 计算 endSeconds 和 endFrames
        duration.endSeconds = Math.floor(duration.end)
        duration.endFrames = Math.round((duration.end - duration.endSeconds) * 30)
        console.log(duration.startSeconds, duration.startFrames, duration.endSeconds, duration.endFrames)
        if (duration.style) {
          duration.style = JSON.stringify(...duration.style)
        }
      })
      // 函数来检查对象是否为空
      function isEmptyObject(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object
      }

      // 你现有的代码逻辑
      if (deepCopiedFilter.animatediff) {
        this.animatediff = true

        // 检查deepCopiedFilter.animatediff.model是否为空对象
        if (isEmptyObject(deepCopiedFilter.animatediff)) {
          this.selectedModel = this.models[0]
        } else {
          this.selectedModel = deepCopiedFilter.animatediff.model
        }
      }

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
        animatediff: this.animatediff ? { model: this.selectedModel } : null,
        // 已有的属性
        ...deepCopiedFilter
      }
      // 时长(真实)是在filter的params里面的，所以需要单独处理。
      this.form.duration = res.duration
      this.form.exDuration = deepCopiedFilter.duration
      if (isCreateAndImport) {
        this.form.id = null
      }
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
.result-video-preview{
  width: 400px;
  height: 400px;
}
.result-image-preview{
  width: 120px;
  height: 180px;
}
.preview-area{
  display: flex;
  margin: 20px;
  flex-wrap: wrap;
}
.single-preview{
  margin: 20px;
  display: flex;
  align-items: center;
}
</style>
