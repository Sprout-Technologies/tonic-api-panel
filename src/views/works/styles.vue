<template>
  <div>
    <el-table :data="stylesEnum" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="createdAt" label="Created At">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="formatTimestamp(scope.row.createdAt)">
            <span>{{ formatTime(scope.row.createdAt) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="revision" label="Revision"></el-table-column>
      <el-table-column prop="config" label="Config">
        <template slot-scope="scope">
          <el-button type="text" @click="showDialog(scope.row)">详情</el-button>
          <el-button type="text" @click="showDialog(scope.row,false)">以此为模板新增</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible="dialogVisible" title="Config Details" width="50%" @close="()=>this.dialogVisible=!this.dialogVisible">
      <el-form :model="currentConfig" label-width="120px">
        <el-form-item label="Denoising Strength">
          <el-input-number v-model="currentConfig.denoising_strength" :min="0" :max="1" step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="CFG">
          <el-input-number v-model="currentConfig.cfg" :min="0" :max="100" :step="1"></el-input-number>
        </el-form-item>

        <el-form-item label="Step">
          <el-input-number v-model="currentConfig.step" :min="0" :max="100" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item v-for="(value, key) in currentConfig" :key="key" :label="key">
          <template v-if="key !== 'openpose'">
            <!-- 处理非 openpose 字段 -->
            <template v-if="key === 'control_mode'">
              <el-select v-model="currentConfig[key]">
                <el-option label="balanced" :value="0"></el-option>
                <el-option label="controlnet" :value="1"></el-option>
                <el-option label="prompt" :value="2"></el-option>
              </el-select>
            </template>
            <template v-else-if="key === 'fallback_extractor'">
              <el-select v-model="currentConfig[key]">
                <el-option
                  v-for="(extractor, extractorKey) in feature_extractor"
                  :key="extractorKey"
                  :label="extractor.model"
                  :value="extractor.model"
                ></el-option>
              </el-select>
            </template>
            <el-template v-else-if="key === 'extractor'">
              <el-select v-model="currentConfig.extractor" :value-key="'model'">
                <el-option
                  v-for="(extractor, key) in feature_extractor"
                  :key="key"
                  :label="key"
                  :value="extractor"
                ></el-option>
              </el-select>
            </el-template>
            <el-form-item v-if="key === 'file'">
              <el-upload
                class="upload-demo"
                :action="uploadAction"
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
            <template v-else-if="key === 'styler'">
              <el-select v-model="currentConfig['styler']">
                <el-option
                  v-for="(style, styleKey) in stylers"
                  :key="styleKey"
                  :label="styleKey"
                  :value="JSON.stringify(style)"
                ></el-option>
              </el-select>
            </template>
            <template v-else-if="key === 'base_model'">
              <el-select v-model="currentConfig['base_model']">
                <el-option
                  v-for="(modelPath, modelName) in base_models"
                  :key="modelName"
                  :label="modelName"
                  :value="modelPath"
                ></el-option>
              </el-select>
            </template>
            <template v-else>
              <component :is="getComponentType(key, value)" v-model="currentConfig[key]">
                <!-- 特殊处理 select 组件的 options -->
                <el-option
                  v-if="getComponentType(key, value) === 'el-select'"
                  v-for="(option, optionKey) in feature_extractor"
                  :key="optionKey"
                  :label="optionKey"
                  :value="option === 'extractor' ? JSON.stringify(option) : option"
                ></el-option>
              </component>
            </template>
          </template>
          <!-- openpose 字段的特殊处理 -->
          <template v-if="key === 'openpose'">
            <template v-if="typeof currentConfig.openpose === 'object'">
              <el-form-item label="Control Mode">
                <el-select v-model="currentConfig.openpose.control_mode">
                  <el-option v-for="(label, value) in controlModes" :key="value" :label="label" :value="Number(value)"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Fallback Extractor">
                <el-select v-model="currentConfig.openpose.fallback_extractor">
                  <el-option
                    v-for="(extractor, key) in feature_extractor"
                    :key="key"
                    :label="key"
                    :value="JSON.stringify(extractor)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </template>
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
      currentConfig: {
        add_detail: -0.4, // 示例值
        approach: 't2i', // 示例值
        base_model: 'general/cetusMix_v4.safetensors [b42b09ff12]', // 示例值
        brightness: 1.1, // 示例值
        control_color: true, // 示例值
        file: 'https://dkfyqdved0mrm.cloudfront.net/public/style_ref/golden/95da916f6c2548908bab3b2c4a35b5ea.png', // 示例值
        id: 'feae86e7-1a2a-4748-be7b-1a57cd491d9e', // 示例值，新建时可能为空
        name: 'test5', // 示例值
        openpose: {
          control_mode: 0, // 示例值
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
        'depth_leres': { 'module': 'depth_leres', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
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
      controlModes: {
        0: 'balanced',
        1: 'controlnet',
        2: 'prompt'
      }
    }
  },
  created() {
    this.fetchItems()
  },
  methods: {
    showDialog(row, isEdit) {
      this.currentConfig = row.configObject // 设置当前配置对象
      if (isEdit) {
        this.currentConfig.id = row.id
      }
      this.currentConfig.name = row.name
      this.dialogVisible = true // 显示模态窗口
      console.log(this.currentConfig, '123123')
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
        })
      })
    },
    getComponentType(key, value) {
      if (typeof value === 'boolean') {
        return 'el-checkbox'
      } else if (key === 'control_mode' || key === 'fallback_extractor' || key === 'extractor') {
        return 'el-select'
      } else {
        return 'el-input'
      }
    },
    handleFileUploadSuccess(response, file) {
      // 处理上传成功后的逻辑，这里假设响应中包含了文件的下载路径
      this.currentConfig.file = response.fileDownloadPath
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
      // 创建一个新的配置对象，深度克隆当前配置
      const configToSubmit = JSON.parse(JSON.stringify(this.currentConfig));

      // 遍历需要处理的字段
      ['denoising_strength', 'cfg', 'step'].forEach(key => {
        configToSubmit[key] = Number(configToSubmit[key])
      })

      // 处理特殊字段的额外处理逻辑
      if (typeof configToSubmit['fallback_extractor'] === 'string') {
        try {
          configToSubmit['fallback_extractor'] = JSON.parse(configToSubmit['fallback_extractor'])
        } catch (e) {
          console.error('Error parsing fallback_extractor: ', e)
          // 处理解析错误，可能需要提供反馈给用户
        }
      }
      // 解析extractor字段为对象
      if (typeof configToSubmit.extractor === 'string') {
        try {
          configToSubmit.extractor = JSON.parse(configToSubmit.extractor)
        } catch (e) {
          console.error('Error parsing extractor: ', e)
          // 处理解析错误，可能需要提供反馈给用户
        }
      }
      // 将整个 configToSubmit 转换为字符串以便保存
      const configString = JSON.stringify(configToSubmit)
      console.log(configString, 'configString')

      updateFilterStyle({
        id: configToSubmit.id,
        name: configToSubmit.name,
        config: configString
      })
        .then((res) => {
          if (res.status === 200) {
          // 接口状态码为200，正常关闭模态窗口
            this.$message.success('保存配置成功')
            this.dialogVisible = false // 关闭模态框
            location.reload() // 重新加载整个页面
          } else {
          // 接口状态码非200，弹出错误提示
            this.$message.error('保存配置失败:' + res.statusText)
          // 这里你可以根据需要显示错误信息给用户
          }
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
