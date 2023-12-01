<template>
  <div class="step-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="选择邮箱" />
      <el-step title="解析Excel" />
      <el-step title="选择模板" />
      <el-step title="选择KOL" />
      <el-step title="预览邮件" />
      <el-step title="发送确认" />
    </el-steps>
    <div class="main-inner">
      <div v-if="active === 0">
        <!-- 邮箱选择逻辑 -->
      </div>
      <div v-if="active === 1">
        <input type="file" @change="handleFileUpload">
        <table v-if="excelData.length > 0">
          <thead>
          <tr>
            <th>Author_uid</th>
            <th>Video URL</th>
            <th>Email</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in excelData" :key="item.email">
            <td>{{ item.author_uid }}</td>
            <td>{{ item.vid_url }}</td>
            <td>{{ item.email }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-if="active === 2">
        <div>123</div>
      </div>
    </div>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
  </div>
</template>

<script>
// 引入SheetJS
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      active: 1,
      excelData: [
        {
          'author_uid': 'Huang He',
          'email': '264987423@qq.com',
          'vid_url': 'https://www.youtube.com/watch?v=9bZkp7q19f0'
        }
      ]
      // 其他数据项...
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        console.log(json, 'sss')
        this.parseExcelData(json)
      }
      reader.readAsArrayBuffer(file)
    },
    parseExcelData(data) {
      // Assuming the first row is the header
      const headers = data[1]
      const author_uid = headers.indexOf('author_uid')
      const vidUrlIndex = headers.indexOf('vid_url')
      const emailIndex = headers.indexOf('email')
      this.excelData = data.slice(2).map(row => ({
        author_uid: row[author_uid],
        vid_url: row[vidUrlIndex],
        email: row[emailIndex]
      }))
      console.log(this.excelData, '123')
    },
    next() {
      if (this.active < 5) {
        this.active++
      } else {
        this.active = 0
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.step-container {
  padding: 180px;
}

/* 增加表格样式 */
table {
  border-collapse: separate;
  border-spacing: 0 1em; /* 设置水平和垂直间距 */
  width: 100%; /* 让表格宽度为100% */
}

th, td {
  padding: 0.5em; /* 单元格内部间距 */
  text-align: left; /* 文本左对齐 */
  vertical-align: top; /* 垂直方向顶部对齐 */
}

/* 可以添加更多的样式来满足您的设计要求 */
</style>
