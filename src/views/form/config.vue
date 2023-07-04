<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item v-for="(c, idx) in constants" :key="c.id">

        <el-row>
        {{'Config #' + idx}}
          <el-button type="danger" icon="el-icon-delete" @click="removeRow(idx)" size="mini"></el-button>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Key">
              <el-input v-model="c.k"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          <el-form-item label="Value">
            <el-input v-model="c.v"   :rows="3" type="textarea"></el-input>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">

            <el-form-item label="Type">
              <el-select style="width: 100%" class="filter-item" v-model="c.type" placeholder="选择类别">
                <el-option :key="'remote'" :label="'remote'" :value="'remote'"></el-option>
                <el-option :key="'local'" :label="'local'" :value="'local'"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
<!--      <br> <br> <br>-->
<!--      <el-form-item v-for="(c,index) in constants" v-if="c.ref" :key="c.id" :label="c.k">-->
<!--        <el-input v-model="c.v"></el-input>-->
<!--        <el-upload-->
<!--          :ref="c.k"-->
<!--          :action="uploadAction"-->
<!--          :headers="uploadToken"-->
<!--          :on-remove="(a,b)=> handleMusicRemove(index, a,b)"-->
<!--          :limit="1"-->
<!--          :on-success="(a,b)=> handleMusicSuccess(index, a,b)">-->
<!--          <el-button size="small" type="primary">上传</el-button>-->
<!--        </el-upload>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="addRow">添加</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {updateBatch, getList} from "@/api/config"
import {getUploadFileURL, getUploadToken} from '@/api/upload'

export default {
  created() {
    this.fetchData()
  },
  data() {
    return {
      form:{},
      constants:[],
        uploadAction: getUploadFileURL(),
        uploadToken:getUploadToken(),
    }
  },
  methods: {
      handleMusicRemove(i,res, file) {

          this.constants[i].v = null;
          this.$forceUpdate()

      },
    addRow(i) {

      this.constants.push({k:"key",v:'value',type:'remote'});
      this.$forceUpdate()

    },
    removeRow(i) {
      this.constants.splice(i, 1)
      this.$forceUpdate()

    },
      handleMusicSuccess(i,res, file) {
          this.constants[i].v = file.response.fileDownloadUri;
          this.$forceUpdate()

      },

    onSubmit() {
      updateBatch(this.constants).then(()=>{
          this.$message({
            message: '提交成功!',
            type: 'success'
          })
          this.onCancel()
        }
      )
    },
    reset() {
      this.form={
        field: '',
        rate: 0,
      }
    },
    onCancel() {
      // this.$router.back(-1)
    },
    fetchData() {
      getList().then(res=>this.constants=res.content)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

