<template>
  <el-container>
    <el-main>
      <el-form ref="form" :model="form" label-width="160px">
        <!-- 基本信息 -->
        <el-form-item label="配置ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="推送名称 (name)" required>
          <el-input v-model="form.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="标题 (title)" required>
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="副标题 (subTitle)">
          <el-input v-model="form.subTitle" placeholder="请输入副标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input type="textarea" v-model="form.body" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="推送链接 (afPushLink)">
          <el-input v-model="form.afPushLink" placeholder="请输入推送链接"></el-input>
        </el-form-item>

        <el-form-item label="用户IDs (userIds)">
          <el-input v-model="form.userIds" placeholder="请输入逗号分隔的用户ID"></el-input>
        </el-form-item>

        <!-- 高级设置 - 可折叠 -->
        <el-collapse v-model="activeNames">
          <el-collapse-item title="高级设置(暂未完全开放,需要使用请咨询开发)" name="1">
            <el-form-item label="启动图片 (launchImage)">
              <el-input v-model="form.launchImage" placeholder="请输入启动图片链接" disabled></el-input>
            </el-form-item>
            <el-form-item label="是否静音 (silent)">
              <el-switch disabled></el-switch>
            </el-form-item>
            <el-form-item label="可变内容 (mutableContent)" disabled>
              <el-switch ></el-switch>
            </el-form-item>
            <el-form-item label="角标 (badge)" disabled="">
              <el-input-number :min="0" placeholder="请输入角标数值"></el-input-number>
            </el-form-item>
            <el-form-item label="声音 (sound)">
              <el-input v-model="form.sound" placeholder="请输入声音文件名"></el-input>
            </el-form-item>
            <el-form-item label="线程ID (threadId)">
              <el-input v-model="form.threadId" placeholder="请输入线程ID"></el-input>
            </el-form-item>
            <el-form-item label="分类 (category)">
              <el-input v-model="form.category" placeholder="请输入分类"></el-input>
            </el-form-item>
            <el-form-item label="目标内容ID (targetContentId)">
              <el-input v-model="form.targetContentId" placeholder="请输入目标内容ID"></el-input>
            </el-form-item>
            <el-form-item label="中断级别 (interruptionLevel)">
              <el-input v-model="form.interruptionLevel" placeholder="请输入中断级别"></el-input>
            </el-form-item>
            <el-form-item label="相关度评分 (relevanceScore)">
              <el-input-number :min="0" :max="1" step="0.1" placeholder="请输入相关度评分" disabled></el-input-number>
            </el-form-item>
            <el-form-item label="过滤条件 (filterCriteria)">
              <el-input v-model="form.filterCriteria" placeholder="请输入过滤条件"></el-input>
            </el-form-item>
            <el-form-item label="过期日期 (staleDate)">
              <el-date-picker v-model="form.staleDate" type="date" placeholder="选择过期日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="时间戳 (timestamp)">
              <el-input-number v-model="form.timestamp" :min="0" placeholder="请输入时间戳"></el-input-number>
            </el-form-item>
            <el-form-item label="事件 (events)">
              <el-input v-model="form.events" placeholder="请输入事件"></el-input>
            </el-form-item>
            <el-form-item label="重要声音级别 (soundCritical)">
              <el-input-number :min="0" placeholder="请输入重要声音级别" disabled></el-input-number>
            </el-form-item>
            <el-form-item label="声音名称 (soundName)">
              <el-input v-model="form.soundName" placeholder="请输入声音名称"></el-input>
            </el-form-item>
            <el-form-item label="声音音量 (soundVolume)">
              <el-slider :min="0" :max="100" show-input disabled></el-slider>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <!-- 表单操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="confirmTestPush">测试推送</el-button>
          <el-button type="primary" @click="savePushConfig">保存推送</el-button>
          <el-button type="danger" @click="confirmSubmitPush">推送</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { updatePush, confirmPush, testPush, getPushDetail } from '@/api/push'
export default {
  data() {
    return {
      form: {
        id: null,
        name: null,
        title: null,
        subTitle: null,
        body: null,
        createdAt: null,
        afPushLink: null,
        userIds: null,
        // 以下字段未标记为disabled，因此保留在data对象中
        sound: null,
        threadId: null,
        category: null,
        targetContentId: null,
        interruptionLevel: null,
        filterCriteria: null,
        staleDate: null,
        events: null,
        soundName: null
      },
      activeNames: ['0'] // 控制折叠面板的默认展开项
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.getPushDetail(id)
    }
  },
  methods: {
    cleanPayload(form) {
      // 过滤空或null的值
      const payload = {}
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== '' && form[key] !== undefined) {
          payload[key] = form[key]
        }
      })
      return payload
    },
    confirmTestPush() {
      this.$confirm('确定要发送测试推送吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.validateForm(['name'])) {
          this.testPush()
        }
      }).catch(() => {
        // 用户取消操作
      })
    },
    async testPush() {
      const payload = this.cleanPayload(this.form)
      await testPush(payload).then(res => {
        this.$message.success('测试推送成功')
      }).catch(err => {
        this.$message.error('测试推送失败')
      })
    },
    savePushConfig() {
      if (this.validateForm(['name'])) {
        const payload = this.cleanPayload(this.form)
        updatePush(payload).then(res => {
          this.$message.success('保存成功')
          this.$router.push({ path: '/pushtools/pushtools' })
        }).catch(err => {
          this.$message.error('保存失败')
        })
      }
    },
    confirmSubmitPush() {
      this.$confirm('确定要发送推送吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.validateFormForPush()) {
          this.submitPush()
        }
      }).catch(() => {
        // 用户取消操作
      })
    },
    getPushDetail(id) {
      getPushDetail(id).then(res => {
        this.form = res
      }).catch(err => {
        this.$message.error('获取推送详情失败')
      })
    },
    submitPush() {
      const payload = this.cleanPayload(this.form)
      if (this.form.id) {
        confirmPush(payload).then(res => {
          this.$message.success('推送成功')
        }).catch(err => {
          this.$message.error('推送失败')
        })
      }
    },
    handleUpdatePush() {
      if (this.validateForm(['name'])) {
        const payload = this.cleanPayload(this.form)
        updatePush(payload).then(res => {
          this.$message.success('保存成功')
        }).catch(err => {
          this.$message.error('保存失败')
        })
      }
    },
    validateForm(requiredFields) {
      for (const field of requiredFields) {
        if (!this.form[field]) {
          this.$message.error(`字段 "${field}" 是必填项。`)
          return false
        }
      }
      return true
    },
    validateFormForPush() {
      if (!this.form.id && !this.form.userIds) {
        this.$message.error('ID或者用户IDs至少填写一个。')
        return false
      }
      return this.validateForm(['name'])
    }
  }
}
</script>

<style scoped>
/* 在此处添加您的样式 */
</style>
