<template>
  <div class="app-container">
    <el-header style="text-align: right; font-size: 12px">
      <el-row>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题搜索" v-model="listQuery.name">
      </el-input>
<!--       <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="小标题搜索" v-model="listQuery.subtitle">-->
<!--      </el-input>-->

<!--       <el-select clearable class="filter-item" value-key="name" placeholder="艺术家" v-model="listQuery['artists.id']" filterable>-->
<!--              <el-option v-for="t in artists.content" :key="t.name" :label="t.name" :value="t.id">-->
<!--              </el-option>-->
<!--        </el-select>-->
      <el-button type="primary" @click="handleFilter()" plain>
        <i class="el-icon-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="primary" @click="handleEdit()" plain>
        <i class="el-icon-edit"></i>
        <span>新增</span>
      </el-button>

      </el-row>

      <br>

    </el-header>
    <el-card>
      <div v-for="(qh,idx) in questionsHead" class="text item" :key="idx">
        {{'问题'+idx+': '+qh}}
      </div>
    </el-card>
    <el-main>

      <el-table
      stripe
      :data="list"
      ref="dragTable"
      v-loading.body="listLoading"
      element-loading-text="Loading"
      :default-sort = "{prop: 'content.createdAt', order: 'ascending'}"
      border fit highlight-current-row>

        <el-table-column
          prop="content.name"
          label="问卷名"
          width="100"
        >
        </el-table-column>

        <el-table-column label="时间"           width="150"
        >
          <template slot-scope="scope">
            {{scope.row.createdAt | moment('YYYY-MM-DD hh:mm')}}
          </template>
        </el-table-column>


        <el-table-column
          v-for="(q,idxx) in questionsHead"
          :key="idxx"
          :label="'问题'+parseInt(idxx+1)">
          <template slot-scope="scope" v-if="scope.row && scope.row.content">
            {{scope.row.content.questions[idxx]['type'] == 'subjective' ?
            scope.row.content.questions[idxx].input :
            scope.row.content.questions[idxx].choices ?
              scope.row.content.questions[idxx].choices.map(i=>i.title).join(','):
              'Invalid'}}
          </template>

        </el-table-column>

        <el-table-column class-name="status-col" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button-group>
<!--              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleOpenDialog(scope.$index, scope.row)"></el-button>

              <el-dialog title="答卷" :visible.sync="dialogFormVisible == scope.row.id">
                <el-form ref="form" :model="scope.row.content" v-if="scope.row.content" label-width="120px">

                    <el-form-item label="问卷名">
                      {{scope.row.content.name}}
                    </el-form-item>
                    <el-form-item v-if="scope.row.userId" label="用户id">
                      {{scope.row.userId}}
                    </el-form-item>

                    <el-divider></el-divider>

                    <el-row v-for="(q,iidx) in scope.row.content.questions" :key="iidx">


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


                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = null">关 闭</el-button>
                </div>
              </el-dialog>

            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
<!--      <div class="pagination-container">-->
<!--        <el-pagination background-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="this.currPage"-->
<!--          :page-count="this.maxPage"-->
<!--          :page-sizes="[10,20,30,50]"-->
<!--          :page-size="listQuery.size"-->
<!--          layout="total, sizes, prev, pager, next"-->
<!--          >-->
<!--        </el-pagination>-->
<!--     </div>-->
    </el-main>
  </div>
</template>

<script>
import { getAnswers } from '@/api/survey'
import Sortable from 'sortablejs'
import {deleteById} from "../../api/post";

const moment = require('moment')
export default {
  data() {
    return {
      // newList:[],
      localUrl: window.location.href.split('://')[0] + '://' + window.location.href.split('://')[1].split('/')[0].replace('1238', '1240').replace('1237', '1240') + '/api/v2/upload/upload_contents/',
      list: null,
      listLoading: true,
      listQuery: {
        size: 99999,
        page: 0,
        sort: ['updatedAt,desc']
      },
      questionsHead: [],
      total: 0,
      currPage: 1,
      maxPage: 0,
      dialogFormVisible: null
    }
  },
  filter: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getList() {
      this.listLoading = true
      return getAnswers().then(response => {
        if (response) {
          this.list = response.map(i => {
            // this.dialogFormVisible = i.id
            i.content = JSON.parse(i.content)
            for (var qIdx in i.content.questions) {
              var q = i.content.questions[qIdx]
              if (!this.questionsHead.includes(q.title)) {
                this.questionsHead.push(q.title)
              }
            }
            return i
          })
          console.log(this.list)
        }
        // this.total = response.totalElements
        // this.currPage = this.listQuery.page + 1
        // this.maxPage = response.totalPages
        this.listLoading = false
        // this.newList = this.list.map((v,idx) => idx)
      })
    },
    fetchData() {
      this.getList()
    },

    handleEdit(idx, r) {
      const pushDest = r ? { name: '答卷表单', params: { id: r.id }} : { name: '答卷表单', params: { id: 'create' }}
      this.$router.push(pushDest)
    },

    handleDelete(idx, r) {
      this.$confirm('删除不可逆，如果要下架，请到表单页勾选下架选项！确定要删除吗？', '提示', {
        confirmButtonText: '我确定要删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(r.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      }).catch((r) => {
        this.$message({
          type: r ? 'error' : 'info',
          message: '删除失败'
        })
      })
    },

    handleBatchPublish() {
      this.$confirm('发布不可逆，请确认。', '提示', {
        confirmButtonText: '我确定要发布',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        publishBatch().then(res => {
          this.$message({
            type: 'success',
            message: '发布成功!'
          })
          this.fetchData()
        })
      }).catch((r) => {
        console.logr(r)
        this.$message({
          type: r ? 'error' : 'info',
          message: '发布失败'
        })
      })
    },

    handlePublish(idx, r) {
      this.$confirm('发布不可逆，请确认。', '提示', {
        confirmButtonText: '我确定要发布',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        publishById(r.id).then(res => {
          this.$message({
            type: 'success',
            message: '发布成功!'
          })
          this.fetchData()
        })
      }).catch((r) => {
        console.logr(r)
        this.$message({
          type: r ? 'error' : 'info',
          message: '发布失败'
        })
      })
    },

    handleOpenDialog(idx, r) {
      console.log(idx)
      console.log(r)
      this.dialogFormVisible = r.id
      console.log(this.dialogFormVisible)
      this.$forceUpdate()
    },
    handleClose() {
      this.$confirm('关闭入口，请确认。', '提示', {
        confirmButtonText: '我确定要关闭',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        close().then(res => {
          this.$message({
            type: 'success',
            message: '成功!'
          })
          this.fetchData()
        })
      }).catch((r) => {
        console.logr(r)
        this.$message({
          type: r ? 'error' : 'info',
          message: '失败'
        })
      })
    },

    handleFilter() {
      if (!this.listQuery.name) { delete this.listQuery.name }
      this.listQuery.page = 0
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.page = 0
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      // this.listQuery.page = val
      this.listQuery.page = val - 1
      this.getList()
    },

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleUploadSuccess(res, file) {
      this.$message({
        message: '上传成功!',
        type: 'success'
      })
      this.fetchData()
    }

  }
}
</script>
<style>
  .pagination-container {
    margin-top: 30px;
    text-align: right;
  }
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
  .upload-demo{
    display: inline-block;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 5px 0;
  }

  .box-card {
    width: 480px;
  }
</style>
