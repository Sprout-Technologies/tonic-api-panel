<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="滤镜名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Preview Cover Image">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handlePreviewCoverImageSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.preview_cover_image" :src="form.preview_cover_image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-col :span="12">
          <el-input v-model="form.preview_cover_image"></el-input>
        </el-col>
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
        <my-select v-model="form.extractor" :options="feature_extractor" placeholder="选择勾线方法"></my-select>
      </el-form-item>
      <el-form-item label="样式提取方法">
        <my-select v-model="form.styler" :options="stylers" placeholder="选择样式提取方法"></my-select>
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
          <el-row gutter={20}>
            <el-col :span="4" class="row-spacing">
              <el-form-item label="Start">
                <el-input-number v-model="duration.start"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="row-spacing">
              <el-form-item label="End">
                <el-input-number v-model="duration.end"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="row-spacing">
              <el-form-item label="Styles">
                <el-select v-model="duration.style" multiple placeholder="Styles">
                  <el-option label="ANIME" value="ANIME"></el-option>
                  <el-option label="TENG" value="TENG"></el-option>
                  <el-option label="VALORANT" value="VALORANT"></el-option>
                  <el-option label="NEON" value="NEON"></el-option>
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
            <el-col :span="4" class="row-spacing">
              <el-form-item label="Montage">
                <el-checkbox v-model="duration.montage"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="row-spacing">
              <el-form-item label="Frame per Style">
                <el-input-number v-model="duration.frame_per_style"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="row-spacing">
              <el-form-item label="Mask Vid">
                <el-input v-model="duration.outpaint.mask_vid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="row-spacing">
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
  </div>
</template>


<script>
import { getById, updateOne } from '@/api/filter'
import MySelect from './MySelect.vue'

export default {
  components: {
    MySelect
  },
  created() {
    this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
    this.fetchData(this.id)
    if (this.id) {
      this.form.id = this.id
    }
  },
  data() {
    return {
      listLoading: false,
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
        durations: []
      },
      base_models: {
        'cetusMix': 'general\\cetusMix_v4.safetensors [b42b09ff12]',
        'dreamshaper': 'general\\dreamshaper_4BakedVae.safetensors [5d18b5b494]',
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
      stylers: {
        't2ia_style_clipvision': { 'module': 't2ia_style_clipvision', 'model': 't2iadapter_style_sd14v1 [202e85cc]' },
        'shuffle': {
          'module': 'shuffle',
          'model': 'control_v11e_sd15_shuffle [526bfdae]',
          'weight': 1.0,
          'start': 0.0,
          'end': 1
        },
        'shuffle_weight15': {
          'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 0.15, 'start': 0.0,
          'end': 1
        },
        'shuffle_mode2': {
          'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 1.0, 'start': 0.0,
          'end': 1, 'control_mode': 2
        }

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
      this.form.preview_cover_image = file.response.fileDownloadUri
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
        style: [],
        type: null,
        interpolation: false,
        montage: false,
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
      this.form.params = JSON.stringify(this.form)
      updateOne(this.form).then(response => {
        if (response.data.success) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message.error('保存失败')
        }
      }).catch(error => {
        this.$message.error('保存失败: ' + error)
      })
    },
    fetchData(id) {
      if (id) {
        this.listLoading = true
        getById(id).then(res => {
          this.listLoading = false
          if (res['params']) {
            try {
              const paramsObj = JSON.parse(res['params'])
              this.form = { ...this.form, ...paramsObj }
            } catch (e) {
              console.error('解析 params 失败', e)
            }
          }
        })
      }
    }
  }
}
</script>
