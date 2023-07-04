<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="缩略图">

        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="uploadAction"
          :headers="uploadToken"
        >
          <img v-if="form.thumb" :src="form.thumb" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-col :span="12">
          <el-input v-model="form.thumb"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="大图">

        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccessPhoto"
          :before-upload="beforeAvatarUpload"
          :action="uploadAction"
          :headers="uploadToken"
        >
          <img v-if="form.photo" :src="form.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-col :span="12">
          <el-input v-model="form.photo"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="技能">
        <el-input v-model="form.skill"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.description"  type="textarea" autosize></el-input>
      </el-form-item>
      <el-form-item label="网易云音乐链接">
        <el-input v-model="form.netease"></el-input>
      </el-form-item>
      <el-form-item label="微信链接">
        <el-input v-model="form.wechat"></el-input>
      </el-form-item>
      <el-form-item label="微博链接">
        <el-input v-model="form.weibo"></el-input>
      </el-form-item>
      <el-form-item label="SoundCloud链接">
        <el-input v-model="form.soundcloud"></el-input>
      </el-form-item>
      <el-form-item label="Facebook链接">
        <el-input v-model="form.facebook"></el-input>
      </el-form-item>
      <el-form-item label="Youtube链接">
        <el-input v-model="form.youtube"></el-input>
      </el-form-item>
      <el-form-item label="权重">
        <el-input v-model="form.weight"></el-input>
      </el-form-item>
      <el-form-item label="其它配置">
        <div class="checkbox checkbox-inline">
          <input  type="checkbox" id="display" value="display" v-model="form.display">
          <label for="display">显示</label>
        </div>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="form.createdAt"

          type="date"
          placeholder="选择创建日期">
        </el-date-picker>
      </el-form-item>
      <el-main>
        <el-button type="primary" @click="newSong">新增曲目</el-button>
        <el-table
          stripe
          ref="dragTable"

          :data="form.works"
          v-loading.body="listLoading"
          element-loading-text="Loading"
          :default-sort = "{prop: 'id', order: 'descending'}"
          border fit highlight-current-row>
          <el-table-column
            sortable
            prop="number"
            label="序号">
            <template slot-scope="scope">
              {{scope.row.number}}
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题">
            <template slot-scope="scope">
              <el-input v-model="scope.row.title"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="url1"
            label="音乐文件地址">
            <template slot-scope="scope">
              <el-input v-model="scope.row.url"></el-input>
              <el-upload
                :ref="scope.row.number"
                :action="uploadAction"
                :headers="uploadToken"
                :on-remove="(a,b)=> handleMusicRemove(scope.$index, a,b)"
                :limit="1"
                :on-success="(a,b)=> handleMusicSuccess(scope.$index, a,b)">
                <el-button size="small" type="primary">上传音乐</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column
            prop="url1"
            label="图片文件地址">
            <template slot-scope="scope">
              <el-input v-model="scope.row.thumb"></el-input>
              <el-upload
                :ref="scope.row.number"
                :action="uploadAction"
                :headers="uploadToken"
                :on-remove="(a,b)=> handleThumbRemove(scope.$index, a,b)"
                :limit="1"
                :on-success="(a,b)=> handleThumbSuccess(scope.$index, a,b)">
                <el-button size="small" type="primary">上传图片</el-button>
              </el-upload>
            </template>

          </el-table-column>
          <!--<el-table-column-->
          <!--prop="url2"-->
          <!--label="国外URL">-->
          <!--<template slot-scope="scope">-->
          <!--<el-input v-model="scope.row.url2"></el-input>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="artist"-->
            <!--label="作者">-->
            <!--<template slot-scope="scope">-->
              <!--<el-input v-model="scope.row.artist"></el-input>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column
            label="删除">
            <template slot-scope="scope">
              <el-button size="mini" @click="delRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{this.id ? '修改':'创建'}}</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {updateOne, getById} from "@/api/artist"
import {getList} from "@/api/category"
import {getUploadFileURL, getUploadToken} from '@/api/upload'
import Sortable from 'sortablejs'

export default {
  created(){
    this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
    this.fetchData(this.id)
    getList().then(res=>this.products = res)
  },
  data() {
    return {
      products:[],
        newList:[],

        uploadAction: getUploadFileURL(),
      uploadToken:getUploadToken(),
      form:{
        name: '',
        createdAt: new Date(),
        display:true,
        works:[]
      }
    }
  },

  methods: {
    onSubmit() {
      updateOne(this.form).then(()=>this.onCancel())
    },
    reset() {
      this.form={
        tag:  {id:null}
      }
    },
    onCancel() {
      this.$router.back(-1)
    },
    fetchData(id) {
      if(id){
        this.listLoading = true;
        getById(id).then(res=>{this.form=res; this.listLoading = false;
            this.newList = this.form.works.map((v,idx) => idx)
            this.$nextTick(() => {
                this.setSort()
            })
        })
      }
    },
    handleMusicRemove(i,res, file) {
      this.form.works[i].url = null;
      this.$forceUpdate()

    },
    handleMusicSuccess(i,res, file) {
      this.form.works[i].url = file.response.fileDownloadUri;
      this.$forceUpdate()

    },
    handleThumbRemove(i,res, file) {
      this.form.works[i].thumb = null;
      this.$forceUpdate()

    },
    handleThumbSuccess(i,res, file) {
      this.form.works[i].thumb = file.response.fileDownloadUri;
      this.$forceUpdate()

    },
    handleAvatarSuccess(res, file) {
      this.form.thumb = file.response.fileDownloadUri;
      this.$forceUpdate()

    },
    handleAvatarSuccessPhoto(res, file) {
      this.form.photo = file.response.fileDownloadUri;
      this.$forceUpdate()

    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.indexOf('image')>=0;

      if (!isJPG) {
        this.$message.error('只能上传图片!');
      }
      return isJPG;
    },
    newSong(){
      let neteaseTmpl = ''

      let maxId = this.form.works ? this.form.works.length + 1 : 0
      this.form.works.push({number:maxId,thumb:'',url:neteaseTmpl,title:''})
    },
    delRow(idx,row){
      this.form.works.splice(idx, 1);

      // this.form.songs =
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
                  console.log(this.move(this.form.works,evt.oldIndex,evt.newIndex))
                  // const targetRow = this.list.splice(evt.oldIndex, 1)[0]
                  console.log(evt.oldIndex)
                  console.log(evt)

                  // this.list.splice(evt.newIndex, 0, targetRow)
                  // for show the changes, you can delete in you code
                  const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
                  this.newList.splice(evt.newIndex, 0, tempIndex)
                  this.newList.map((val,idx)=>this.form.works[val].number=idx+1)
                  // this.updateList()
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
          for(let i = 1 ; i <= arr.length; i++){
              arr[i-1].number = i
          }
          return arr
      }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

