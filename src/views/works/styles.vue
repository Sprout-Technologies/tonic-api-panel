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
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible="dialogVisible" title="Config Details" width="50%" @close="()=>this.dialogVisible=!this.dialogVisible">
      <el-form :model="currentConfig" label-width="120px">
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
            <template v-else>
              <el-input v-model="currentConfig[key]"></el-input>
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
        <el-button type="primary" @click="saveConfig(scope.row)">保存</el-button>
      </el-form>
      <div slot="reference" class="config-preview">详情</div>
    </el-dialog>
  </div>
</template>


<script>
import { getFilterStyle } from '@/api/filter'

export default {
  data() {
    return {
      stylesEnum: [],
      dialogVisible: false, // 新增用于控制模态窗口显示的属性
      currentConfig: {}, // 新增当前配置对象，用于表单绑定
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
    showDialog(row) {
      this.currentConfig = row.configObject // 设置当前配置对象
      this.dialogVisible = true // 显示模态窗口
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
    saveConfig(item) {
      // 如果 fallback_extractor 是字符串，则将其解析回对象
      if (typeof item.configObject.openpose.fallback_extractor === 'string') {
        item.configObject.openpose.fallback_extractor = JSON.parse(item.configObject.openpose.fallback_extractor)
      }

      // 将整个 configObject 转换为字符串以便保存
      item.config = JSON.stringify(item.configObject)
      // ... 发送到服务器的代码 ...
      this.dialogVisible = false // 关闭模态窗口
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
</style>
