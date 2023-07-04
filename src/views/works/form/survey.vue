<template>
  <div class="app-container">

    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="问卷名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-main>
        <h2>问卷内容</h2>
        <el-row v-for="(q,iidx) in form.questions" :key="iidx">
          <el-form-item :label="'问题'+parseInt(iidx+1)">
            <el-input v-model="q.title"></el-input>
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="q.subtitle"></el-input>
          </el-form-item>
          <el-row>
            <el-col>
              <el-form-item label="是否必选">
                <template>
                  <el-checkbox :label="'Required'"  v-model="q.required"></el-checkbox>
                </template>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="类型">
                <el-select style="width: 100%" class="filter-item" v-model="q.type" placeholder="选择类型">
                  <el-option v-for="t in ['choice','multiChoice','subjective']" :key="t" :label="t" :value="t">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item v-if="q.type !== 'subjective'" v-for="(o,idx) in q.options" :key="idx" :label="'选项'+parseInt(idx+1)">
            <el-input v-model="o.title"></el-input>
          </el-form-item>
          <el-button v-if="q.type !== 'subjective'" type="primary" @click="newOption(iidx)">新增选项</el-button>


          <el-divider></el-divider>
        </el-row>
        <el-button type="primary" @click="newQuestion">新增问题</el-button>

      </el-main>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{this.id ? '修改':'创建'}}</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {updateOne, getById} from "@/api/survey"
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
      this.form.questions.push({
        title:'New Question',
        subtitle:'',
        options:[],
        type:'subjective'
      })
    },
    newOption(iidx){
      if(this.form.questions[iidx].options){
        this.form.questions[iidx].options.push({
          title:'New Option',
        })
      }else{
        this.form.questions[iidx].options = [{
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
        getById(id).then(res => {
          this.listLoading = false;
          this.form = res
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

