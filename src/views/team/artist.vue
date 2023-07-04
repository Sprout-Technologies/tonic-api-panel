<template>
  <div class="app-container">
    <el-header style="text-align: right; font-size: 12px">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名搜索" v-model="listQuery.name">
      </el-input>
       <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="技能搜索" v-model="listQuery.skill">
      </el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="listQuery['display']" filterable placeholder="是否显示">
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
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
      ref="dragTable"
      element-loading-text="Loading"
      border fit highlight-current-row>
        <el-table-column sortable align="center" prop="id" label='序号' width="95">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="skill"
          label="技能">
        </el-table-column>
        <el-table-column label="显示">
          <template slot-scope="scope">
            {{scope.row.display ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createdAt | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>
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
import {queryList, deleteById, updateBatch} from "@/api/artist"
import Sortable from 'sortablejs'

const moment = require('moment')
export default {
  data() {
    return {
        newList:[],
      list: null,
      listLoading: true,
      listQuery: {
        size: 99999,
        page: 0,
        sort:['weight,asc','display,desc']
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
          this.newList = this.list.map((v,idx) => idx)

          this.$nextTick(() => {
              this.setSort()
          })
      })
    },
      updateList(){
          this.listLoading = true
          return updateBatch(this.list).then(response => {
              this.listLoading = false
          })
      },
    fetchData() {
      this.getList()
    },
      setSort() {
          const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
          this.sortable = Sortable.create(el, {
              ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
              setData: function(dataTransfer) {
                  // to avoid Firefox bug
                  // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                  dataTransfer.setData('Text', '')
              },
              onEnd: evt => {
                  console.log(this.move(this.list,evt.oldIndex,evt.newIndex))
                  // const targetRow = this.list.splice(evt.oldIndex, 1)[0]
                  console.log(evt.oldIndex)
                  console.log(evt)

                  // this.list.splice(evt.newIndex, 0, targetRow)
                  // for show the changes, you can delete in you code
                  const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
                  this.newList.splice(evt.newIndex, 0, tempIndex)
                  this.newList.map((val,idx)=>this.list[val].weight=idx)
                  this.updateList()
              }
          })
      },


      move(arr,index,tindex){
          //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
          //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
          var arr = JSON.parse(JSON.stringify(arr))
          if(index>tindex){
              arr.splice(tindex,0,arr[index]);
              arr.splice(index+1,1)
          }
          else{
              //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
              //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
              arr.splice(tindex+1,0,arr[index]);
              arr.splice(index,1)
          }
          for(let i = 0 ; i < arr.length; i++){
              arr[i].weight = i
          }
          return arr
      },

    handleEdit(idx,r){
      let pushDest = r ? { name: '艺术家表单', params: { id: r.id }} : { name: '艺术家表单' , params: { id: 'create'}}
      this.$router.push(pushDest)
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
      if(!this.listQuery.name){delete this.listQuery.name}
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
</style>
