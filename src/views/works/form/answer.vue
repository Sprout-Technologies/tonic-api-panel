<template>
  <div class="app-container">

    <el-form ref="form" :model="form" v-if="form.content" label-width="120px">
      <el-main>

        <el-form-item label="问卷名">
          {{form.content.name}}
        </el-form-item>
        <el-form-item v-if="form.userId" label="用户id">
          {{form.userId}}
        </el-form-item>

        <el-divider></el-divider>

        <el-row v-for="(q,iidx) in form.content.questions" :key="iidx">


          <el-form-item :label="'问题'+parseInt(iidx+1)">
            {{q.title}}

          </el-form-item>

          <el-form-item v-if="q.type !== 'subjective' && q.choices" label="选项">
            {{q.choices.map(i=>i.title).join(',')}}
          </el-form-item>
          <el-form-item v-if="q.type === 'subjective'" label="回复">
            {{q.input}}
          </el-form-item>

          <el-divider></el-divider>
        </el-row>

      </el-main>

      <el-form-item>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {updateOne, getAnswer} from "@/api/survey"
import {getUploadFileURL, getUploadToken} from '@/api/upload'
// import {queryList as queryAristsList} from "@/api/artist"

export default {
  created(){
    this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
    this.localUrl = window.location.href.split("://")[0]+"://"+window.location.href.split("://")[1].split('/')[0].replace("1238","1240").replace("1237","1240")+'/api/v2/upload/upload_contents/'
    this.fetchData(this.id)
  },
  data() {
    return {
      form:{questions:[]}
    }
  },
  methods: {

    onSubmit() {
      updateOne(this.form).then(() => this.onCancel())
    },
    newQuestion(){
      this.form.content.questions.push({
        title:'New Question',
        subtitle:'',
        options:[],
        type:'subjective'
      })
    },
    newOption(iidx){
      if(this.form.content.questions[iidx].options){
        this.form.content.questions[iidx].options.push({
          title:'New Option',
        })
      }else{
        this.form.content.questions[iidx].options = [{
          title:'New Option',
        }]
      }
      this.$forceUpdate()
    },
    handleTagChange() {
      this.refreshTag()
    },
    onExport() {
      exportData(this.form)
    },

    reset() {
      this.form = {
        layers: [],
      }
    },
    onCancel() {
      this.$router.back(-1)
    },
    fetchData(id) {
      // queryAristsList({size:99999}).then(res=>this.artists = res)

      if (id) {
        this.listLoading = true
        getAnswer(id).then(res => {
          this.listLoading = false;
          this.form = res
          this.form.content = JSON.parse(this.form.content)
        })

      } else {

      }
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.thumb {
  width: 100px;
  height: 100px;
  display: block;
}
.thumb-uploader-icon {
  width: 100px;
  height: 100px;
  display: block;
}
.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  display: block;
}

/*.el-input-number--mini{*/
/*  width: 100px!important;*/
/*}*/
</style>

