<template>
  <div class="app-container">
    <h3>
      授权文件列表
    </h3>
    <el-header style="text-align: right; font-size: 12px">
      <el-input style="width:200px" placeholder="授权名称" v-model="listQuery['name']"></el-input>

      <el-input style="width:200px"  placeholder="文件路径" v-model="listQuery['path']"></el-input>

      <el-select clearable style="width: 200px" class="filter-item" v-model="listQuery['trail']" filterable placeholder="是否试用">
        <el-option label="试用" :value="true"></el-option>
        <el-option label="非试用" :value="false"></el-option>
      </el-select>
      <el-button type="primary" @click="handleFilter()" plain>
        <i class="el-icon-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="primary" @click="handleEdit()" plain>
        <i class="el-icon-edit"></i>
        <span>新增</span>
      </el-button>
    </el-header>
    <el-main>

      <el-table
        stripe
        :data="list"
        v-loading.body="listLoading"
        element-loading-text="Loading"
        :default-sort = "{prop: 'id', order: 'descending'}"
        border fit highlight-current-row>
        <el-table-column align="center" label='序号' width="95">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="授权名称" align="center">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="path"-->
          <!--label="文件路径" align="center">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="trail"
          label="是否试用授权" align="center" width="100px">
          <template slot-scope="scope">
            {{scope.row.trail ? '是' : '否'}}
          </template>
        </el-table-column>

        <el-table-column sortable
                         prop="createdAt"
                         label="创建时间" align="center">
          <template slot-scope="scope">
            {{scope.row.createdAt | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.$index, scope.row)"></el-button>
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
                       :page-size="listQuery.size"
                       layout="total, sizes, prev, pager, next"
        >
        </el-pagination>
      </div>
    </el-main>


  </div>
</template>

<script>
  import {getList, deleteById, queryList} from "@/api/jobs"

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
          size: 10,
          page: 0,
          sort: 'id,desc'
        },
        total:0,
        currPage:1,
        maxPage:0,
        categories:[],
        tags: [],
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
      genRowClass({row, rowIndex}){
        if(!row || !row.type) return ''
        if(row.type.indexOf('正常')<0)
          return 'warning-row'
        else
          return 'success-row'
      },
      fetchData() {
        this.listLoading = true
        this.getList()
      },
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
      handleFilter(){
        if(!this.listQuery['trail']){delete this.listQuery['trail']}
        if(!this.listQuery['path']){delete this.listQuery['path']}
        if(!this.listQuery['name']){delete this.listQuery['name']}

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
      handleEdit(idx,r){
        // let pushDest = r ? { name: '文章表单', params: { id: r.id }} : { name: '撰写文章' , params: { id: 'create'}}
        let pushDest = r ? { name: '授权文件表单', params: { id: r.id }} : { name: '授权文件表单' , params: { id: 'create'}}
        this.$router.push(pushDest)
      },
      handlePublish(idx,r){
        this.$confirm('发布后不可撤回，请确认！', '提示', {
          confirmButtonText: '我确定要发布',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          publish(r.id).then(res=>{
            if(res) {
              this.$message({
                type: 'success',
                message: '发布成功!'
              });
            }else{
              this.$message({
                type: 'error',
                message: '发布失败!'
              });
            }
            this.fetchData()})
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
    }
  }
</script>
<style>
  .pagination-container {
    margin-top: 30px;
    text-align: right;
  }
</style>
