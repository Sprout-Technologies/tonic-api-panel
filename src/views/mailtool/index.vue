<template>
  <div class="step-container">
    <el-button style="margin-left:35%;width:480px;margin-bottom:30px;" @click="next" type="text">下一步</el-button>
    <el-steps :active="active" finish-status="success">
      <el-step title="选择邮箱" />
      <el-step title="解析Excel" />
      <el-step title="选择KOL" />
      <el-step title="选择模板/预览邮件" />
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
      <div v-if="active === 2" style="display: flex;justify-content: center">
        <el-transfer
          v-model="selectedKOLs"
          :data="formattedExcelData"
          :titles="['可选 KOL', '已选 KOL']"
          :props="{ key: 'key', label: 'label' }">
        </el-transfer>
      </div>
      <div v-if="active === 3" style="display: flex;align-items: center;justify-content: space-around">
        <el-radio-group v-model="activeTemplate">
          <el-radio label="default">默认模板</el-radio>
          <el-radio label="none">测试</el-radio>
        </el-radio-group>
        <div   class="email-content"  v-html="emailTemplate[activeTemplate]" style="width: 400px;height: 400px;" id="1"/>
        <div   class="email-content"  v-html="emailPreview[activeTemplate]" style="width: 400px;height: 400px;" id="2"/>
      </div>
    </div>
  </div>
</template>

<script>
// 引入SheetJS
import * as XLSX from 'xlsx'
export default {
  data() {
    return {
      active: 3,
      activeTemplate: 'default', // 新增属性
      selectedKOLs: [
      ],
      kolList: [], // 用于存储已选 KOL
      excelData: [
        {
          'author_uid': 'Huang He',
          'email': '264987423@qq.com',
          'vid_url': 'https://www.youtube.com/watch?v=9bZkp7q19f0'
        }
      ],
      emailTemplate: {
        default: `<p>Hello!</p>

<p>I came across your page and absolutely love your content —
<a href=vid_url style="color: blue; text-decoration: underline;">this one$(vid_url)</a>
is so good!</p>

<p>
<a href="https://apps.apple.com/us/app/tonic-ai-video-editing/id6448806466" style="color: blue; text-decoration: underline;">Tonic</a>
is a new way for you to add some extra oomph to your videos and transitions with the help of AI. I wanted to personally invite you to try the app for yourself and collaborate with us on some content.
</p>

<p>If you’re interested in a paid partnership, could you please let me know your rates for:</p>

<ol>
  <li>Creating and posting a video on TikTok (around 15s)</li>
  <li>Cross-posting the same video on Instagram/YouTube</li>
</ol>

<p>You can download the app
<a href="https://apps.apple.com/us/app/tonic-ai-video-editing/id6448806466" style="color: blue; text-decoration: underline;">here</a>
to see it for yourself and check out the attached files for an example of Tonic-blended videos.
</p>

<p>Happy to provide more details if you have any questions!</p>

<p>Very best,<br>
Skylar</p>

<p><em>Skylar</em><br>
<em>Creative Coordinator</em><br>
<a href="https://tonic.video/" target="_blank" rel="noopener noreferrer" class="gmail-sh-preserve-color" title="https://tonic.video/" style="text-decoration-line:none">
    <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4yMbw2FD8vYOUqH1h442-fiiievdiFeAgQRKJGiRO_2-OtlVUlT2w6Dc-7X13uhYrTwXJbyZg4" height="44" width="96" class="gmail-sh-preserve-color" style="border: 0px; margin: 0px; padding: 0px; max-width: 100%; height: auto;">
</a>`,
        none: `<p>Hello!</p>`
      },
      emailPreview: {
        default: `<p>Hello!</p>

<p>I came across your page and absolutely love your content —
<a href="https://www.tiktok.com/@jydn.lol/video/6974506328261659910" style="color: blue; text-decoration: underline;">this one</a>
is so good!</p>

<p>
<a href="https://apps.apple.com/us/app/tonic-ai-video-editing/id6448806466" style="color: blue; text-decoration: underline;">Tonic</a>
is a new way for you to add some extra oomph to your videos and transitions with the help of AI. I wanted to personally invite you to try the app for yourself and collaborate with us on some content.
</p>

<p>If you’re interested in a paid partnership, could you please let me know your rates for:</p>

<ol>
  <li>Creating and posting a video on TikTok (around 15s)</li>
  <li>Cross-posting the same video on Instagram/YouTube</li>
</ol>

<p>You can download the app
<a href="https://apps.apple.com/us/app/tonic-ai-video-editing/id6448806466" style="color: blue; text-decoration: underline;">here</a>
to see it for yourself and check out the attached files for an example of Tonic-blended videos.
</p>

<p>Happy to provide more details if you have any questions!</p>

<p>Very best,<br>
Skylar</p>

<p><em>Skylar</em><br>
<em>Creative Coordinator</em><br>
<a href="https://tonic.video/" target="_blank" rel="noopener noreferrer" class="gmail-sh-preserve-color" title="https://tonic.video/" style="text-decoration-line:none">
    <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4yMbw2FD8vYOUqH1h442-fiiievdiFeAgQRKJGiRO_2-OtlVUlT2w6Dc-7X13uhYrTwXJbyZg4" height="44" width="96" class="gmail-sh-preserve-color" style="border: 0px; margin: 0px; padding: 0px; max-width: 100%; height: auto;">
</a>`,
        none: `<p>Hello!</p>`
      }
      // 其他数据项...
    }
  },
  async mounted() {
    try {
      await this.loadGmailApi()
      // 可选: 在这里调用 sendEmail 或其他依赖于 gapi 的方法
    } catch (error) {
      console.error('Error loading Gmail API', error)
    }
  },
  computed: {
    formattedExcelData() {
      return this.excelData.map((item, index) => ({
        key: index, // 假设每行数据都是唯一的
        label: item.author_uid,
        email: item.email,
        vid_url: item.vid_url
      }))
    }
  },
  watch: {
    selectedKOLs(newVal) {
      this.kolList = newVal.map(key => this.excelData[key])
    }
  },
  methods: {
    async loadGmailApi() {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://apis.google.com/js/api.js'
        script.onload = () => {
          gapi.load('client:auth2', () => {
            gapi.client.init({
              apiKey: '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',
              clientId: '360536567137-328dfg34nt1hos0hpr7rsit6la60buts.apps.googleusercontent.com',
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
              scope: 'https://www.googleapis.com/auth/gmail.send'
            }).then(resolve, reject)
          })
        }
        script.onerror = reject
        document.head.appendChild(script)
      })
    },
    sendEmail() {
      const emailLines = [
        'To: 264987423@QQ.com',
        'Subject: Email Subject',
        'Content-Type: text/html; charset=UTF-8',
        '',
        'Email Body in HTML'
      ]
      const email = emailLines.join('\r\n').trim()
      const base64EncodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

      gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
          'raw': base64EncodedEmail
        }
      }).then(response => {
        console.log('Email sent', response)
      })
    },
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
    },
    next() {
      this.sendEmail()
      /*     if (this.active < 5) {
        this.active++
      } else {
        this.active = 0
      }*/
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.step-container {
  padding: 180px;
  display: flex;
  flex-direction: column;
}

/* 增加表格样式 */
table {
  border-collapse: separate;
  border-spacing: 0 1em; /* 设置水平和垂直间距 */
  width: 100%; /* 让表格宽度为100% */
}
.email-content a {
  color: blue;
  text-decoration: underline;
}

th, td {
  padding: 0.5em; /* 单元格内部间距 */
  text-align: left; /* 文本左对齐 */
  vertical-align: top; /* 垂直方向顶部对齐 */
}

/* 可以添加更多的样式来满足您的设计要求 */
</style>
