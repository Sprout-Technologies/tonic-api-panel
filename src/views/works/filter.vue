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

        <el-upload
          class="upload-demo"
          :action="uploadAction"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :headers="uploadToken"
          :on-success="handleUploadSuccess"
          :on-exceed="handleExceed">
<!--          <el-button type="primary">导入Zip</el-button>-->
        </el-upload>
      </el-row>

      <br>

    </el-header>
    <el-main>

      <el-table
        stripe
        :data="list"
        v-loading.body="listLoading"
        element-loading-text="Loading"
        :default-sort = "{prop: 'createdAt', order: 'ascending'}"
        border fit highlight-current-row>
        <el-table-column align="center" label="缩略图" width="70">
          <template slot-scope="scope">
            <div v-if="scope.row.icon || scope.row.preview_cover_image" style="background-color: black; width: 50px; height: 50px">
              <img :src="scope.row.icon|| scope.row.preview_cover_image" width="50" height="50"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.visibilityStatus === 0" type="info">隐藏</el-tag>
            <el-tag v-else-if="scope.row.visibilityStatus === 1" type="success">上线</el-tag>
            <el-tag v-else-if="scope.row.visibilityStatus === 2" type="warning">测试</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="id">
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            {{scope.row.updatedAt | moment('YYYY-MM-DD hh:mm:ss')}}
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createdAt | moment('YYYY-MM-DD hh:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="success" v-if=" scope.row.publishedAt == null || scope.row.publishedAt < scope.row.updatedAt" icon="el-icon-upload" size="mini" @click="handlePublish(scope.$index, scope.row)"></el-button>

              <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index, scope.row)"></el-button>
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
import { queryList, deleteById, publishById, inform, publishBatch, updateOrder, getAvailableTags } from '@/api/filter'
import Sortable from 'sortablejs'
import { getImportFileURL, getUploadToken } from '@/api/upload'

export default {
  data() {
    return {
      newList: [],
      list: null,
      listLoading: true,
      listQuery: {
        size: 99999,
        page: 0,
        sort: ['weight,asc', 'updatedAt,desc']
      },
      total: 0,
      currPage: 1,
      maxPage: 0,
      uploadAction: getImportFileURL(),
      uploadToken: getUploadToken()
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
      return queryList(this.listQuery).then(response => {
        this.list = response.content
        this.total = response.totalElements
        this.currPage = this.listQuery.page + 1
        this.maxPage = response.totalPages
        this.listLoading = false
        this.newList = this.list.map((v, idx) => idx)

        this.$nextTick(() => {
          this.setSort()
        })
      })
    },
    fetchData() {
      this.getList()
    },

    handleEdit(idx, r) {
      const pushDest = r ? { name: '滤镜表单', params: { id: r.id }} : { name: '滤镜表单', params: { id: 'create' }}
      this.$router.push(pushDest)
    },
    orderList(payload) {
      this.listLoading = true
      return updateOrder(payload).then(response => {
        this.listLoading = false
      })
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
        console.log(r)
        this.$message({
          type: r ? 'error' : 'info',
          message: '发布失败'
        })
      })
    },

    informUsers() {
      this.$confirm('请确认要通知用户。', '提示', {
        confirmButtonText: '我确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        inform().then(res => {
          this.$message({
            type: 'success',
            message: '通知成功!'
          })
        })
      }).catch((r) => {
        console.log(r)
        this.$message({
          type: r ? 'error' : 'info',
          message: '通知失败'
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
        console.log(r)
        this.$message({
          type: r ? 'error' : 'info',
          message: '发布失败'
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
</style>
