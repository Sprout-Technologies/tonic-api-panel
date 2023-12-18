<template>
  <div>
    <el-table :data="stylesEnum" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="createdAt" label="Update At">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="formatTimestamp(scope.row.createdAt)">
            <span>{{ formatTime(scope.row.createdAt) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="revision" label="版本号"></el-table-column>
      <el-table-column prop="config" label="Config">
        <template slot-scope="scope">
          <el-button type="text" @click="showDialog(scope.row,true)">详情</el-button>
          <el-button type="text" @click="showDialog(scope.row,false)">以此为模板新增</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" title="Config Details" width="50%" @close="()=>this.$refs.styleDialog.doClose()" ref="styleDialog">
      <el-form :model="currentConfig" label-width="120px">
        <el-form-item label="id">
          <el-input v-model="currentConfig.id"></el-input>
        </el-form-item>
        <el-form-item label="revision" v-if="currentConfig.revision">
        <el-input v-model="currentConfig.revision"></el-input>
      </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="currentConfig.name"></el-input>
        </el-form-item>
        <el-form-item label="Add Detail">
          <el-input v-model="currentConfig.add_detail"></el-input>
        </el-form-item>
        <el-form-item label="Approach">
          <el-input v-model="currentConfig.approach"></el-input>
        </el-form-item>
        <el-form-item label="Base Model">
          <el-select v-model="currentConfig.base_model">
            <el-option
              v-for="(value, key) in base_models"
              :key="key"
              :label="key"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Brightness">
          <el-input v-model="currentConfig.brightness"></el-input>
        </el-form-item>
        <el-form-item label="Contrast">
          <el-input v-model="currentConfig.contrast"></el-input>
        </el-form-item>
        <el-form-item label="Control Color">
          <el-checkbox v-model="currentConfig.control_color"></el-checkbox>
        </el-form-item>
        <el-form-item label="Control Style">
          <el-checkbox v-model="currentConfig.control_style"></el-checkbox>
        </el-form-item>
        <el-form-item label="File">
          <el-upload
            class="upload-demo" :action="uploadAction"
          :headers="uploadToken"
          :on-success="(response, file) => handleFileUploadSuccess(response, file)"
          :before-upload="beforeFileUpload"
          >
          <el-button size="small" type="primary">点击上传文件</el-button>
          <div v-if="currentConfig.file">
            <img :src="currentConfig.file" alt="文件预览" class="image-preview">
          </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Openpose">
          <el-checkbox v-model="isOpenposeEnabled" @change="handleOpenPoseChange"></el-checkbox>
          <el-form-item label="Weight" v-if="currentConfig.openpose">
            <el-input v-model="currentConfig.openpose.weight" style="width: 100px"/>
          </el-form-item>
              <el-form-item label="Control Mode" v-if="currentConfig.openpose">
                <el-select v-model="currentConfig.openpose.control_mode">
                  <el-option v-for="(label, value) in controlModes" :key="value+label" :label="label" :value="Number(value)"></el-option>
                </el-select>
              </el-form-item>
          <el-form-item label="Fallback Extractor" v-if="currentConfig.openpose">
            <el-select v-model="currentConfig.openpose.fallback_extractor" value-key="model">
              <el-option
                v-for="(extractor, key) in feature_extractor"
                :key="key+extractor"
                :label="key"
                :value="extractor"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="勾线方法">
          <el-select v-model="currentConfig.extractorKey" placeholder="选择勾线方法">
            <el-option v-for="(item, key) in feature_extractor" :label="key" :value="key" :key="key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Styler">
          <el-select v-model="currentConfig.styler">
            <el-option
              v-for="(style, styleKey) in stylers"
              :key="styleKey"
              :label="styleKey"
              :value="JSON.stringify(style)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Tag Prompt">
          <el-checkbox v-model="currentConfig.tag_prompt"></el-checkbox>
        </el-form-item>
        <el-form-item label="Trigger Prompt">
          <el-input v-model="currentConfig.trigger_prompt"></el-input>
        </el-form-item>
        <el-form-item label="Adetailer">
          <el-checkbox v-model="currentConfig.adetailer"></el-checkbox>
        </el-form-item>
        <el-form-item label="Denoising Strength">
          <el-input v-model="currentConfig.denoising_strength"></el-input>
        </el-form-item>
        <el-form-item label="CFG">
          <el-input v-model="currentConfig.cfg"></el-input>
        </el-form-item>
        <el-form-item label="STEP">
          <el-input v-model="currentConfig.step"></el-input>
        </el-form-item>
        <el-form-item label="sampler">
          <el-select v-model="currentConfig.sampler" placeholder="请选择采样器">
            <el-option
              v-for="(value, index) in samplerEnum"
              :key="index"
              :label="value || '无'"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="saveConfig(currentConfig)">保存</el-button>
      </el-form>
<!--      <div slot="reference" class="config-preview">详情</div>-->
    </el-dialog>
  </div>
</template>


<script>
import { getFilterStyle, updateFilterStyle } from '@/api/filter'
import { getUploadFileURL, getUploadToken } from '@/api/upload'
export default {
  data() {
    return {
      stylesEnum: [],
      dialogVisible: false, // 新增用于控制模态窗口显示的属性
      uploadAction: getUploadFileURL(),
      uploadToken: getUploadToken(),
      isOpenposeEnabled: false,
      currentConfig: {
        add_detail: -0.4, // 示例值
        extractorKey: '',
        approach: 't2i', // 示例值
        revision: 0,
        base_model: 'general/cetusMix_v4.safetensors [b42b09ff12]', // 示例值
        brightness: 1.1, // 示例值
        control_color: true, // 示例值
        file: 'https://dkfyqdved0mrm.cloudfront.net/public/style_ref/golden/95da916f6c2548908bab3b2c4a35b5ea.png', // 示例值
        id: 'feae86e7-1a2a-4748-be7b-1a57cd491d9e', // 示例值，新建时可能为空
        name: 'test5', // 示例值
        sampler: '',
        openpose: {
          control_mode: 0, // 示例值
          weight: 1,
          fallback_extractor: {
            model: 'control_v11p_sd15_softedge [a8575a2a]',
            module: 'softedge_hed'
          }
        },
        styler: {
          model: 't2iadapter_style_sd14v1 [202e85cc]',
          module: 't2ia_style_clipvision'
        },
        denoising_strength: 0.5, // 默认值
        cfg: 50, // 默认值
        step: 50 // 默认值
      }, // 新增当前配置对象，用于表单绑定
      feature_extractor: {
        '无': null,
        'lineart_realistic_prompt': { 'control_mode': 1, 'module': 'lineart_realistic', 'model': 'control_v11p_sd15_lineart [43d4be0d]' },
        'lineart_standard_prompt': { 'control_mode': 1, 'module': 'lineart_standard',
          'model': 'control_v11p_sd15_lineart [43d4be0d]' },
        'lineart_realistic': { 'module': 'lineart_realistic',
          'model': 'control_v11p_sd15_lineart [43d4be0d]' },
        'lineart_coarse': { 'module': 'lineart_coarse', 'model': 'control_v11p_sd15_lineart [43d4be0d]' },
        'lineart': { 'module': 'lineart', 'model': 'control_v11p_sd15_lineart [43d4be0d]' },
        'lineart_anime': { 'module': 'lineart_anime', 'model': 'control_v11p_sd15s2_lineart_anime [3825e83e]' },
        'softedge_hedsafe': { 'module': 'softedge_hedsafe', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
        'softedge_hed': { 'module': 'softedge_hed', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
        'softedge_pidinet': { 'module': 'softedge_pidinet', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
        'softedge_pidisafe': { 'module': 'softedge_pidisafe', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
        'depth_zoe': { 'module': 'depth_zoe', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
        'depth_midas': { 'module': 'depth_midas', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
        'depth_leres': { 'model': 'control_v11p_sd15_softedge [a8575a2a]', 'module': 'depth_leres' },
        'depth_leres++': { 'module': 'depth_leres++', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
        'canny': { 'module': 'canny', 'model': 'control_v11p_sd15_canny [d14c016b]' },
        'normal_bae': { 'module': 'normal_bae', 'model': 'control_v11p_sd15_normalbae [316696f1]' },
        'segmentation': { 'module': 'segmentation', 'model': 'control_v11p_sd15_seg [e1f51eb9]' },
        't2ia_sketch_pidi': { 'module': 't2ia_sketch_pidi', 'model': 't2iadapter_sketch_sd15v2 [f5789421]' }
      },
      stylers: {
        't2ia_style_clipvision': { 'module': 't2ia_style_clipvision', 'model': 't2iadapter_style_sd14v1 [202e85cc]' },
        'shuffle': { 'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 1.0, 'start': 0.0, 'end': 1 },
        'shuffle_weight15': { 'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 0.15, 'start': 0.0,
          'end': 1 },
        'shuffle_mode2': { 'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 1.0, 'start': 0.0,
          'end': 1, 'control_mode': 2 }
      },
      base_models: {
        'cetusMix': 'general/cetusMix_v4.safetensors [b42b09ff12]',
        'dreamshaper': 'new/dreamshaper_8.safetensors [879db523c3]',
        'revAnimated': 'general/revAnimated_v122.safetensors [ea1a6218f7]',
        'deliberate': 'general/deliberate_v2.safetensors [f0406fe1d4]',
        'rundiffusionFX': 'general/rundiffusionFX_v10.safetensors [ad1a10552b]',
        'rundiffusionFX25D': 'general/rundiffusionFX25D_v10.safetensors [ad1a10552b]',
        'meinaPastelInpaint': 'general/meinapastel_v6-inpainting.safetensors',
        'revAnimatedInpaint': 'general/revAnimated_v121Inp-inpainting.safetensors',
        'dreamShaperInpaint': 'general/dreamshaper_8Inpainting.safetensors',
        'meinaUnrealInpaint': 'general/meinaunreal_v41-inpainting.safeFtensors',
        'meinaMixInpaint': 'general/meinamix_v11-inpainting.safetensors'
      },
      controlModes: {
        0: 'balanced',
        1: 'controlnet',
        2: 'prompt'
      },
      samplerEnum:
        [null, 'LCM', 'DPM++ 2M Karras', 'DPM++ SDE Karras', 'DPM++ 2M SDE Exponential', 'DPM++ 2M SDE Karras', 'Euler a', 'Euler', 'LMS', 'Heun', 'DPM2', 'DPM2 a', 'DPM++ 2S a', 'DPM++ 2M', 'DPM++ SDE', 'DPM++ 2M SDE', 'DPM++ 2M SDE Heun', 'DPM++ 2M SDE Heun Karras', 'DPM++ 2M SDE Heun Exponential', 'DPM++ 3M SDE', 'DPM++ 3M SDE Karras', 'DPM++ 3M SDE Exponential', 'DPM fast', 'DPM adaptive', 'LMS Karras', 'DPM2 Karras', 'DPM2 a Karras', 'DPM++ 2S a Karras', 'Restart', 'DDIM', 'PLMS', 'UniPC']
    }
  },
  created() {
    this.fetchItems()
  },
  methods: {
    showDialog(row, isEdit) {
      this.currentConfig.id = undefined
      this.currentConfig = row.configObject // 设置当前配置对象
      if (row.id && isEdit) {
        this.currentConfig.id = row.id
      }
      this.currentConfig.name = row.name
      this.currentConfig.revision = row.revision
      this.isOpenposeEnabled = !!this.currentConfig.openpose
      this.dialogVisible = !this.dialogVisible // 显示模态窗口
    },
    fetchStylesEnum() {
      return getFilterStyle().then(res => {
        const { content } = res
        this.stylesEnum = content
      })
    },
    fetchItems() {
      this.fetchStylesEnum().then(() => {
        this.stylesEnum.forEach(item => {
          item.configObject = JSON.parse(item.config)
          if (item.configObject.openpose) {
            item.isOpenposeEnabled = true
          }
        })
      })
    },
    handleOpenPoseChange(value) {
      if (value) {
        // 使用 Vue.set 更新对象以确保响应式更新
        this.$set(this.currentConfig, 'openpose', {
          control_mode: 0,
          weight: 1,
          fallback_extractor: {
            model: 'control_v11p_sd15_softedge [a8575a2a]',
            module: 'softedge_hed'
          }
        })
      } else {
        // 删除 openpose 属性
        this.$delete(this.currentConfig, 'openpose')
      }
    },
    handleFileUploadSuccess(response, file) {
      // 处理上传成功后的逻辑，这里假设响应中包含了文件的下载路径
      this.currentConfig.file = response.fileDownloadPath.replace(
        /^https:\/\/sprout-tonic-app.*?\/public\//,
        'https://dkfyqdved0mrm.cloudfront.net/public/'
      )
    },

    beforeFileUpload(file) {
      // 这里可以添加上传前的检查逻辑，例如文件大小限制等
      return true // 返回false则停止上传
    },

    clearFile() {
      // 清除已上传的文件
      this.currentConfig.file = null
    },
    saveConfig() {
      console.log(this.currentConfig)
      // 创建一个新的配置对象，深度克隆当前配置
      const configToSubmit = JSON.parse(JSON.stringify(this.currentConfig));

      // 遍历需要处理的字段
      ['denoising_strength', 'cfg', 'step'].forEach(key => {
        configToSubmit[key] = Number(configToSubmit[key])
      })

      // 处理特殊字段的额外处理逻辑
      if (this.isJsonString(configToSubmit.fallback_extractor)) {
        try {
          configToSubmit.fallback_extractor = JSON.parse(configToSubmit.fallback_extractor)
        } catch (e) {
          console.error('Error parsing fallback_extractor: ', e)
          // 处理解析错误，可能需要提供反馈给用户
        }
      }
      configToSubmit.extractor = this.feature_extractor[configToSubmit.extractorKey]
      if (this.isOpenposeEnabled) {
        configToSubmit.openpose = this.currentConfig.openpose
      } else {
        delete configToSubmit.openpose
      }
      // 将整个 configToSubmit 转换为字符串以便保存
      const configString = JSON.stringify(configToSubmit)
      updateFilterStyle({
        id: configToSubmit.id,
        name: configToSubmit.name,
        config: configString,
        revision: configToSubmit.revision
      })
        .then((res) => {
          // 接口状态码为200，正常关闭模态窗口
          this.$message.success('保存配置成功')
          setTimeout(() => {
            location.reload()
          }, 1000)
        })
        .catch((error) => {
        // 捕获其他可能的错误
          this.dialogVisible = false
          this.$message.error('保存配置时发生错误:' + error)
        })
    },
    // 辅助函数，检查字符串是否为有效的 JSON
    isJsonString(str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    },
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString()
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp)
      return date.toISOString()
    }
  }
}
</script>

<style scoped>
.config-preview {
  display: inline-block;
  padding: 5px;
  background-color: #ebebeb;
  cursor: pointer;
}
.image-preview{
  width: 200px;
  height: 200px;
}
</style>
