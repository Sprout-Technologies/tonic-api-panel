<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="职位">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
       <el-form-item label="邮箱">
        <el-input v-model.number="form.mail"></el-input>
      </el-form-item>
      <el-form-item label="简介">
                <el-input v-model="form.description"  type="textarea" autosize></el-input>
              </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{this.id ? '修改':'创建'}}</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {updateOne, getById} from "@/api/jobs"
export default {
  created() {
    this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
    this.fetchData(this.id)
  },
  data() {
    return {
      form: {
        name: '',
        createdAt: new Date(),
      }
    }
  },
  methods: {
    onSubmit() {
      updateOne(this.form).then(()=>{
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
        name: '',
        monthdiff: 0,
      }
    },
    onCancel() {
      this.$router.back(-1)
    },
    fetchData(id) {
      id && getById(id).then(res=>this.form=res)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

