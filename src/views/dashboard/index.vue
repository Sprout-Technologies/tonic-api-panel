<template>
  <div class="app-container">
    <h3>
      首屏 / Post列表
    </h3>
    <el-header style="text-align: right; font-size: 12px">
      <!--<el-input style="width:200px" placeholder="URL别名" v-model="listQuery['name']"></el-input>-->

      <el-input style="width:200px"  placeholder="用户" v-model="listQuery['user.nickname']"></el-input>

      <!--<el-select clearable style="width: 100px" class="filter-item" v-model="listQuery['category.id']" filterable placeholder="请选择栏目">-->
        <!--<el-option v-for="c in categories.content" :key="c.id" :label="c.name" :value="c.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-select multiple style="width: 200px" class="filter-item" v-model="listQuery['products.id']" filterable placeholder="请选择产品">-->
        <!--<el-option v-for="t in products.content" :key="t.id" :label="t.name" :value="t.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
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
        :default-sort = "{prop: 'weight', order: 'ascending'}"
        border fit highlight-current-row>
<!--        <el-table-column align="center" label='Post id'>-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.id}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column align="center" label='Video id'>-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.videos[0].id}}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column align="center" label='滤镜名'>
          <template slot-scope="scope">
            {{scope.row.videos[0].filter.name}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='缩略图'>
          <template slot-scope="scope">
            <div v-if="scope.row.videos[0].thumbnail" style="background-color: black; max-height: 100px;">
              <img :src="scope.row.videos[0].thumbnail" style="max-height: 100px;"/>
              <img :src="scope.row.videos[0].thumbnail.replace('last_preview','first_frame')" style="max-height: 100px;"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="hidden"
          label="用户" align="center">
          <template slot-scope="scope">
            {{scope.row.user.nickname}} <el-button type="primary" size="mini" @click="copyIdToClipboard(scope.row.user.id)">id</el-button>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="name"-->
          <!--label="URL别名" align="center">-->
        <!--</el-table-column>-->
<!--        <el-table-column-->
<!--          prop="captions"-->
<!--          label="内容" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.captions && scope.row.captions.length > 0 ? scope.row.captions[0].content: ""}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="featured"-->
<!--          label="置顶" align="center" width="100px">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.featured ? '是' : '否'}}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <!--<el-table-column-->
          <!--prop="category.name"-->
          <!--label="栏目" align="center">-->
        <!--</el-table-column>-->
        <el-table-column sortable
                         prop="createdAt"
                         label="发布时间" align="center">
          <template slot-scope="scope">
            {{scope.row.createdAt | moment('YYYY-MM-DD hh:mm:ss')}}
          </template>
        </el-table-column>
<!--        <el-table-column align="center" label='精选'>-->
<!--          <template slot-scope="scope">-->
<!--            <el-button type="primary" size="mini" @click="featureSubmit(scope.row.id)">{{scope.row.visibilityStatus ===1 && scope.row.weight<=0.0 ? '取消精选 ':'精选'}}</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column align="center" label='拷贝视频'>
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="copyIdToClipboard(scope.row.videos[0].id)">id</el-button>
            <el-button type="primary" size="mini" @click="copyOriginalVidUrlToClipboard(scope.row.videos[0].id)">原</el-button>
            <el-button type="primary" size="mini" @click="copyVidUrlToClipboard(scope.row.videos[0])">高分</el-button>
          </template>
        </el-table-column>

<!--        <el-table-column class-name="status-col" label="操作" width="200" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-group>-->

<!--              <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.$index, scope.row)"></el-button>-->
<!--              <el-button type="success" icon="el-icon-success" size="small" :disabled="scope.row.latest.published" @click="handlePublish(scope.$index, scope.row)"></el-button>-->
<!--              <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.$index, scope.row)"></el-button>-->
<!--            </el-button-group>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column class-name="status-col" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>
                          <el-button type="primary" size="mini" @click="featureSubmit(scope.row.id)">{{scope.row.visibilityStatus === 1 && scope.row.weight>0.0 ? '撤':'精'}}</el-button>

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
                       :page-size="listQuery.size"
                       layout="total, sizes, prev, pager, next"
        >
        </el-pagination>
      </div>
    </el-main>


  </div>
</template>

<script>
  import {getList, deleteById, queryList, publish, updateBatch} from "@/api/post"
  // import {getList as getCategoryList} from "@/api/category"
  // import {getList as getProductsList} from "@/api/artist"
  import Sortable from 'sortablejs'
  import { feature, getOriginalVidFile } from '@/api/post'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
            size: 10,
            page: 0,
          sort:['createdAt,desc']
          // sort:['createdAt,desc','hidden,asc'],
          // 'category.id':2
        },
        total:0,
        currPage:1,
        maxPage:0,
        // categories:[{id:2}],
        products: [],
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
        // getCategoryList().then(res=>{
        //   this.categories = res
        // })
        // getProductsList().then(res=>{
        //   this.products = res
        // })
      },
      copyVidUrlToClipboard (video) {
        var url = video.highresUrl
        if (!url){url = video.url}
        navigator.clipboard.writeText(url).then(() => {this.$message.success('复制成功')})
      },
      copyOriginalVidUrlToClipboard (id) {
        getOriginalVidFile(id).then(response => {
          navigator.clipboard.writeText(response).then(() => {this.$message.success('复制成功')})
        })
      },
      copyIdToClipboard(id){
        navigator.clipboard.writeText(id).then(() => {this.$message.success('复制成功')})

      },
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

      featureSubmit(id) {
        feature(id).then(() => {
            this.$message({
              message: '提交成功!',
              type: 'success'
            })
          this.fetchData()
          }
        )
      },

        updateList(){
            this.listLoading = true
            return updateBatch(this.list).then(response => {
                this.listLoading = false

                // getList()
            })
        },
        setSort() {
            // const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            // this.sortable = Sortable.create(el, {
            //     ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
            //     setData: function(dataTransfer) {
            //         // to avoid Firefox bug
            //         // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            //         dataTransfer.setData('Text', '')
            //     },
            //     onEnd: evt => {
            //         console.log(this.move(this.list,evt.oldIndex,evt.newIndex))
            //         // const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            //         console.log(evt.oldIndex)
            //         console.log(evt)
            //
            //         // this.list.splice(evt.newIndex, 0, targetRow)
            //         // for show the changes, you can delete in you code
            //         const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            //         this.newList.splice(evt.newIndex, 0, tempIndex)
            //         this.newList.map((val,idx)=>this.list[val].weight=idx)
            //         this.updateList()
            //     }
            // })
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
        if(!this.listQuery['category.id']){delete this.listQuery['category.id']}
        if(!this.listQuery['products.id']){delete this.listQuery['products.id']}
        if(!this.listQuery['name']){delete this.listQuery['name']}
        if(!this.listQuery['latestPublished.title']){delete this.listQuery['latestPublished.title']}

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
        let pushDest = r ? { name: '文章表单', params: { id: r.id }} : { name: '文章表单' , params: { id: 'create'}}
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
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
</style>
