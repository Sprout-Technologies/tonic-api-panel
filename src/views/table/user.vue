<template>
  <div class="app-container">
    <el-header style="text-align: right; font-size: 12px">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="id搜索" v-model="listQuery.id">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名搜索" v-model="listQuery.nickname">
      </el-input>
      <el-button type="primary" @click="handleFilter()" plain>
        <i class="el-icon-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="primary" @click="handleEdit()" plain>
        <i class="el-icon-edit"></i>
        <span>新增</span>
      </el-button>
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
        <el-table-column sortable align="center" prop="id" label='id' width="95">
        </el-table-column>
        <el-table-column sortable
          prop="nickname"
          label="昵称" width="110">
        </el-table-column>
        <el-table-column sortable
          prop="tel"
          label="电话" width="110" align="center">
        </el-table-column>
        <el-table-column sortable
          prop="deleted"
          label="权限" width="110" align="center">
          <template slot-scope="scope">
            {{scope.row.deleted ? '已删除' : '正常用户'}}
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="birthday"-->
<!--          label="生日" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.birthday | moment('YYYY-MM-DD')}}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          prop="createdAt"
          label="创建日期" align="center">
          <template slot-scope="scope">
            {{scope.row.createdAt | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="最后登录日期" align="center">
          <template slot-scope="scope">
            {{scope.row.latestLogin | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="primary" size="mini" @click="kolSubmit(scope.row.id)">{{scope.row.fake === true ? '撤':'白'}}</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index, scope.row)"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currPage"
          :page-count="this.maxPage"
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery.take"
          layout="total, sizes, prev, pager, next"
          >
        </el-pagination>
     </div>
    </el-main>
  </div>
</template>

<script>
import {queryList, deleteById, kol} from "@/api/user"

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        size: 10,
        page: 0
      },
      total:0,
      currPage:1,
      maxPage:0,

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
    getList(){
      this.listLoading = true
      return queryList(this.listQuery).then(response => {
        this.list = response.content
        this.total = response.totalElements
        this.currPage = this.listQuery.page + 1
        this.maxPage = response.totalPages
        this.listLoading = false
      })
    },
    fetchData() {
      this.getList()
    },
    handleEdit(idx,r){
      let pushDest = r ? { name: '管理用户表单', params: { id: r.id }} : { name: '管理用户表单' , params: { id: 'create'}}
      this.$router.push(pushDest)
    },
    kolSubmit(id){
      kol(id).then(res=>{
        this.$message({
          type: 'success',
          message: '设置成功!'
        });
        this.fetchData()
      })
    },
    handleDelete(idx,r){
      this.$confirm('删除不可逆，如有关联数据，删除将失败。', '提示', {
          confirmButtonText: '我确定要删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteById(r.id).then(res=>{
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            this.fetchData()
          })

        }).catch((r) => {
          this.$message({
            type: r ? 'error' : 'info',
            message: '删除失败'
          });
        });
    },
    handleFilter(){
      if(!this.listQuery.id){delete this.listQuery.id}
      if(!this.listQuery.nickname){delete this.listQuery.nickname}

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
      this.listQuery.page = (val-1)
      this.getList()
    },
  }
}
</script>
<style>
  .pagination-container {
    margin-top: 30px;
    text-align: right;
  }
</style>
