<template>
  <div class="app-container">
    <el-header style="text-align: right; font-size: 12px">
      <el-input style="width:200px" placeholder="事件搜索" v-model="listQuery['eventName']"></el-input>
      <el-input style="width:200px" placeholder="发起人搜索" v-model="listQuery['firedBy']"></el-input>
      <el-input style="width:200px" placeholder="终点搜索" v-model="listQuery['destination']"></el-input>

      <el-button type="primary" @click="handleFilter()" plain>
        <i class="el-icon-search"></i>
        <span>搜索</span>
      </el-button>
<!--      <el-button type="primary" @click="handleEdit()" plain>-->
<!--        <i class="el-icon-edit"></i>-->
<!--        <span>新增</span>-->
<!--      </el-button>-->
    </el-header>
    <el-main>

      <el-table
        stripe
        :data="list"
        ref="dragTable"
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
          prop="eventName"
          label="事件名称" align="center">
        </el-table-column>
        <el-table-column
          prop="firedBy"
          label="发起人" align="center">
        </el-table-column>
        <el-table-column
          prop="destination"
          label="事件终点" align="center">
        </el-table-column>
        <el-table-column
          prop="payload"
          label="数据" align="center">
        </el-table-column>
        <el-table-column sortable
                         prop="createdAt"
                         label="发布时间" align="center">
          <template slot-scope="scope">
            {{scope.row.createdAt | moment('YYYY-MM-DD hh:mm:ss')}}
          </template>
        </el-table-column>
<!--        <el-table-column class-name="status-col" label="操作" width="200" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-group>-->
<!--              <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.$index, scope.row)"></el-button>-->
<!--              <el-button type="danger"  icon="el-icon-delete" size="small" @click="handleDelete(scope.$index, scope.row)"></el-button>-->
<!--            </el-button-group>-->
<!--          </template>-->

<!--        </el-table-column>-->
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
  import {getList, deleteById, queryList, updateBatch} from "@/api/event"
  // import {getList as getUsersList, adminList} from "@/api/user";
  import Sortable from 'sortablejs'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
          size: 50,
          page: 0,
            sort:['createdAt,desc'],
        },
        total:0,
        currPage:1,
        maxPage:0,
        categories:[],
        tags: [],
        users: [],
        admins: []
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
        // getUsersList().then(response=>{
        //   this.users = response.content
        // })
        // adminList().then(response=>{
        //   this.admins = response.content
        // })
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

                // getList()
            })
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
      handleFilter(){
        if(!this.listQuery['license.name']){delete this.listQuery['license.name']}
        if(!this.listQuery['license.path']){delete this.listQuery['license.path']}
        if(!this.listQuery['license.trail']){delete this.listQuery['license.trail']}
        if(!this.listQuery['issuer.id']){delete this.listQuery['issuer.id']}
        if(!this.listQuery['user.id']){delete this.listQuery['user.id']}
        if(!this.listQuery['status']){delete this.listQuery['status']}

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
      let pushDest = r ? { name: '招聘信息表单', params: { id: r.id }} : { name: '招聘信息表单' , params: { id: 'create'}}
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
        this.$confirm('确定拒绝该请求吗', '提示', {
          confirmButtonText: '我确定要拒绝请求',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          approve(r.id,'false').then(res=> {
            if (res) {

            this.$message({
              type: 'success',
              message: '拒绝请求!'
            });
            this.fetchData()
          }else{
              this.$message({
                type: r ? 'error' : 'info',
                message: '拒绝请求失败'
              });
            }
          })

        }).catch((r) => {
          this.$message({
            type: r ? 'error' : 'info',
            message: '拒绝请求失败'
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
