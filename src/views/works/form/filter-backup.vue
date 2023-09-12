<template>
  <div class="app-container">

    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="滤镜名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="时长">
        <el-input v-model="form.duration"></el-input>
      </el-form-item>

<!--       <el-form-item label="类别">-->
<!--        <el-select-->
<!--          multiple-->
<!--          allow-create-->
<!--          change="handleTagChange"-->
<!--          v-model="filterTagsView" filterable-->
<!--          style="width: 100%" class="filter-item" placeholder="选择或输入类别">-->
<!--          <el-option v-for="t in availableTags" :key="t" :label="t" :value="t">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-row :gutter="5">
        <el-col :span="6">
      <el-form-item label="图标" >

        <el-upload
          :on-change="(a,b)=>handleFileChange(a,b,'icon')"
          :file-list="File['icon']"

          class="avatar-uploader"
          :show-file-list="false"

          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="uploadAction"
          :data="{'path':'icon'}"
          :headers="uploadToken"
        >
          <div v-if="form.icon" style="background-color: black">
            <img v-if="form.icon!==undefined" :src="form.icon" class="avatar">
          </div>

          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div v-if="form.icon" >

          <el-button @click="handleRemove('icon')">清除图片</el-button>
        </div>

        <!--        <el-col :span="12">-->
<!--          <el-input v-model="form.icon"></el-input>-->
<!--        </el-col>-->
      </el-form-item>
        </el-col>
        <el-col :span="6">
      <el-form-item label="封面图">

        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="(a,b)=>handleFileChange(a,b,'previewCoverImage')"
          :file-list="File['previewCoverImage']"
          :on-success="handlePreviewCoverImageSuccess"
          :before-upload="beforeAvatarUpload"
          :action="uploadAction"
          :headers="uploadToken"
          :data="{'path':'cover_images'}"
        >
          <div v-if="form.previewCoverImage" >
            <img :src="form.previewCoverImage" class="avatar">
          </div>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div v-if="form.previewCoverImage" >

          <el-button @click="handleRemove('previewCoverImage')">清除图片</el-button>
        </div>
<!--        <el-col :span="12">-->
<!--          <el-input v-model="form.foregroundImageDownload"></el-input>-->
<!--        </el-col>-->
      </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="预览视频">
            <el-input disabled v-model="form.previewVideo"></el-input>
            <el-upload
              :action="uploadAction"
              :headers="uploadToken"
              :limit="1"
              :on-change="(a,b)=>handleFileChange(a,b,'previewVideo')"
              :on-success="handlePreviewVideoSuccess"
              :before-upload="beforeAvatarUpload"
              :data="{'path':'preview_video'}"

            >
              <el-button size="small" type="primary">上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="6">
<!--      <el-form-item label="背景色">-->

<!--        <el-color-picker v-model="form.backgroundColor"></el-color-picker>-->
<!--      </el-form-item>-->
        </el-col>
        <el-col :span="6">


      </el-col>
      </el-row>




      <!--<el-form-item label="其它配置">-->
        <!--<div class="checkbox checkbox-inline">-->
          <!--<input  type="checkbox" id="display" value="display" v-model="form.display">-->
          <!--<label for="display">显示</label>-->
        <!--</div>-->
      <!--</el-form-item>-->
<!--      <el-form-item label="Bundle链接">-->
<!--        <el-input v-model="form.bundleUrl"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="其他设置">-->
<!--        <el-checkbox v-model="form.hidden">隐藏</el-checkbox>-->
<!--      </el-form-item>-->


      <el-form-item label="参数Json">
        <el-input v-model="form.params" type="textarea"  :rows="10"></el-input>
      </el-form-item>


      <el-main>

        <el-button type="primary" @click="newLayer">新增区间</el-button>

        <el-table
          stripe
          ref="dragTable"
          v-if="form.paramsObj && form.paramsObj['durations']"
          :data="form.paramsObj['durations']"
          row-key="z"
          v-loading.body="listLoading"
          element-loading-text="Loading"
          @row-click="clickRow"

          border fit highlight-current-row>
          <el-table-column
            prop="image"
            label="图像">
            <template v-slot:default="scope">

                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :ref="scope.row.z"
                  :on-success="(a,b)=> handleRowSuccess(scope.$index, a,b)"
                  :before-upload="beforeAvatarUpload"
                  :action="uploadAction"
                  :data="{'path':'layers'}"
                  :headers="uploadToken"
                  :on-change="(a,b)=>handleFileChange(a,b,'layer_'+scope.row.name)"
                  :file-list="File['layer_'+scope.row.name]"
                >
                  <div style="background-color: black" v-if="scope.row.image">
                  <img :src="scope.row.image" class="thumb">
                  </div>

                  <i v-else class="el-icon-plus thumb-uploader-icon"></i>
                </el-upload>
                <!--        <el-col :span="12">-->
                <!--          <el-input v-model="form.icon"></el-input>-->
                <!--        </el-col>-->

            </template>
          </el-table-column>
          <el-table-column
            prop="start"
            label="开始时间">
            <template v-slot:default="scope">
              <el-input-number :precision="2" size="mini" controls-position="right" :step="5" @change="handleChangeT(scope.row)" v-model="realX[scope.row.name]"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            prop="end"
            label="结束时间">
            <template v-slot:default="scope">
              <el-input-number :precision="2" size="mini" controls-position="right" :step="5" @change="handleChangeT(scope.row)" v-model="realY[scope.row.name]"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            prop="frame_per_style"
            label="几帧一渲">
            <template v-slot:default="scope">
              <el-input-number size="mini" controls-position="right" :step="1" @change="handleChangeT(scope.row)" v-model="realY[scope.row.name]"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            prop="end"
            label="细节修正(-2到2)">
            <template v-slot:default="scope">
              <el-input-number size="mini" controls-position="right" :step="0.05" @change="handleChangeT(scope.row)" v-model="realY[scope.row.name]"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            prop="cfg"
            label="cfg">
            <template v-slot:default="scope">
              <el-input-number size="mini" controls-position="right" :step="1" @change="handleChangeT(scope.row)" v-model="realY[scope.row.name]"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            prop="control_style"
            width="90"
            label="控制样式">
            <template v-slot:default="scope">
                <el-checkbox v-model="form.hidden"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="control_color"
            width="90"
            label="控制颜色">
            <template v-slot:default="scope">
                <el-checkbox v-model="form.hidden"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="tag_prompt"
            width="90"
            label="使用tagger">
            <template v-slot:default="scope">
              <el-checkbox v-model="form.hidden"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="interpolation"
            width="90"
            label="补帧">
            <template v-slot:default="scope">
              <el-checkbox v-model="form.hidden"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="adetailer"
            width="90"
            label="开启adetailer">
            <template v-slot:default="scope">
              <el-checkbox v-model="form.hidden"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="renderer"
            width="90"

            label="渲染方式">
            <template v-slot:default="scope">
              <el-select style="width: 100%" class="filter-item" v-model="scope.row.facialPart" filterable placeholder="选择类别" @change="handleFacialPartChange(scope.row)">
                <el-option v-for="t in facialPartValues" :key="t" :label="t" :value="t">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column
            prop="extractor"
            width="90"

            label="勾线方式">
            <template v-slot:default="scope">
              <el-select style="width: 100%" class="filter-item" v-model="scope.row.facialPart" filterable placeholder="选择类别" @change="handleFacialPartChange(scope.row)">
                <el-option v-for="t in facialPartValues" :key="t" :label="t" :value="t">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="styler"
            width="90"

            label="样式学习方式">
            <template v-slot:default="scope">
              <el-select style="width: 100%" class="filter-item" v-model="scope.row.facialPart" filterable placeholder="选择类别" @change="handleFacialPartChange(scope.row)">
                <el-option v-for="t in facialPartValues" :key="t" :label="t" :value="t">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            width="90"

            label="轮播方式">
            <template v-slot:default="scope">
              <el-select style="width: 100%" class="filter-item" v-model="scope.row.facialPart" filterable placeholder="选择类别" @change="handleFacialPartChange(scope.row)">
                <el-option v-for="t in facialPartValues" :key="t" :label="t" :value="t">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="model"
            width="90"

            label="底模">
            <template v-slot:default="scope">
              <el-select style="width: 100%" class="filter-item" v-model="scope.row.facialPart" filterable placeholder="选择类别" @change="handleFacialPartChange(scope.row)">
                <el-option v-for="t in facialPartValues" :key="t" :label="t" :value="t">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="trigger_prompt"
            label="触发词">
            <template v-slot:default="scope">
                <el-input v-model="form.title"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="gender_prompt"
            label="性别触发词">
            <template v-slot:default="scope">
              <el-input v-model="form.title"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template v-slot:default="scope">
              <el-button  type="text" size="mini" @click="delRow(scope.$index, scope.row)" icon="el-icon-delete"></el-button>

              <el-button  type="text" v-if="scope.$index>0" size="mini" @click="moveUp(scope.$index, scope.row)" icon="el-icon-top"></el-button>

              <el-button  type="text" v-if="scope.$index<form.layers.length-1" size="mini" @click="moveDown(scope.$index, scope.row)" icon="el-icon-bottom"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{this.id ? '修改':'创建'}}</el-button>
        <el-button @click="onCancel">返回</el-button>
<!--        <el-button v-if="this.id" @click="onExport">导出</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {updateOne, getById, exportData} from "@/api/filter"
import {getUploadFileURL, getUploadToken} from '@/api/upload'
// import {queryList as queryAristsList} from "@/api/artist"
import Konva from 'konva';
import parseAPNG from 'apng-js';
import {getAvailableTags, getBuffer} from "../../../api/filter";
export default {
  created(){
    this.id = this.$route.params.id === 'create' ? null : this.$route.params.id
    this.fetchData(this.id)
  },
  data() {
    return {
      // availableTags:[],
      // filterTagsView:[],
      loadedImages: 0,
      // imagesToLoad: 0,
      foregroundHide:true,
      selectedShapeName:'',
      FIXED_WH: 618,
      newList:[],
      facialPartValues: "eyes,eyebrows,nose,outerLips,innerLips,leftEye,rightEye,leftEyebrow,rightEyebrow".split(','),
      uploadAction: getUploadFileURL(),
      uploadToken:getUploadToken(),
      listLoading: false,
      form:{
        paramsObj: {
          'durations':[]
        },
        layers: [],
        online: true
      },
      File:{},
      scaleInput:{

      },
      realX:{

      },
      realY:{

      },

      apng:{

      },
      rotationInput:{

      },

      configKonva: {
        width: 618,
        height: 618
      },
      facialPartPos: {
        '欢乐黑人老哥': {
          eyes: {
            x1: 42.5, y1: 37.25, x2: 55.75, y2: 36.75,
            lineVisible: true
          },

          nose: {
            x1: 45.5, y1: 40.5, x2: 53.5, y2: 40.5,
            lineVisible: false
          },
          outerLips: {
            x1: 41.5, y1: 49.5, x2: 57.5, y2: 49,
          },
          innerLips: {
            x1: 46, y1: 50.5, x2: 54, y2: 50,
            lineVisible: false

          },
          leftEye: {
            x1: 39.5, y1: 37.5, x2: 45.5, y2: 37, lineVisible: false
          },
          rightEye: {
            x1: 52.5, y1: 37, x2: 59, y2: 36.5, lineVisible: false
          },
          rightEyebrow: {
            x1: 51, y1: 33.5, x2: 60.5, y2: 34, lineVisible: false

          },
          leftEyebrow: {
            x1: 37, y1: 36, x2: 46, y2: 34, lineVisible: false
          },
          eyebrows: {
            x1: 41.5, y1: 35, x2: 55.75, y2: 33.75,
            lineVisible: false
          },
        },
        '冷漠亚裔女性': {
          eyes: {
            x1: 42.5, y1: 37.75, x2: 57, y2: 37.75,
            lineVisible: true
          },
          eyebrows: {
            x1: 42.25, y1: 34, x2: 56.75, y2: 33.25,
            lineVisible: false
          },
          nose: {
            x1: 47, y1: 44, x2: 53, y2: 44,
            lineVisible: false
          },
          outerLips: {
            x1: 45, y1: 52.2, x2: 54, y2: 52,
          },
          innerLips: {
            x1: 47, y1: 52.2, x2: 52, y2: 52.2,
            lineVisible: false

          },
          leftEye: {
            x1: 39, y1: 37.5, x2: 46, y2: 38, lineVisible: false
          },
          rightEye: {
            x1: 53.5, y1: 38, x2: 60.5, y2: 37.5, lineVisible: false
          },
          rightEyebrow: {
            x1: 52, y1: 33, x2: 61.5, y2: 33.5, lineVisible: false

          },
          leftEyebrow: {
            x1: 37.5, y1: 34, x2: 47, y2: 34, lineVisible: false
          },
        }
      },

      configCircle: {
        radius: 3,
        fill: "red",
        stroke: "black",
        strokeWidth: 0.5
      }
    }
  },
  methods: {
    clickRow(row){
      this.selectedShapeName = row.name
      this.updateTransformer()
    },
    handleRemove(attr) {
      this.form[attr]=null
      this.$forceUpdate()
    },
    handleLayerNameChange(r){
      var z = this.form.layers.filter(i=>i.name===r.name).map(j=>j.z)
      console.log(z)
      if(z.length > 1){
        var idx = z[1] - 1
        this.form.layers[idx].name += '_2'
      }
    },
    handleFileChange(file, fileList, k) {
      if(!this.File[k]){
        this.File[k] = []
      }
      if (fileList.length > 1) {
        fileList.splice(0, 1);
        this.File[k] = [];
      }
      this.File[k].push(fileList[0].raw)
    },
    handleFacialPartChange(layer){
      var idx = this.form.layers.findIndex(i=>i.name===layer.name)

      this.form.layers[idx].x1 = this.facialPartPos[this.selectedCharacter][layer.facialPart].x1
      this.form.layers[idx].x2 = this.facialPartPos[this.selectedCharacter][layer.facialPart].x2
      this.form.layers[idx].y1 = this.facialPartPos[this.selectedCharacter][layer.facialPart].y1
      this.form.layers[idx].y2 = this.facialPartPos[this.selectedCharacter][layer.facialPart].y2
      // this.form.layers[idx].offsetX=0
      // this.form.layers[idx].offsetY=0
      this.form.layers[idx] = this.recalculate(layer)
      this.setScale(layer)
      this.rotate(layer)
      this.rotationInput[layer.name] = -this.rotationInput[layer.name]
      console.log(this.rotationInput)
      this.rotate(layer)

      this.$forceUpdate()
    },
    handleCharacterChange(){
      this.form.layers = this.form.layers.map(i=>this.recalculate(i))

      this.$forceUpdate()
    },
    scale(layer) {
      if(layer) {
        return this.lineLength(layer) / this.lineLength(this.facialPartPos[this.selectedCharacter][layer.facialPart])
      }
    },
    rotation(layer) {
      return this.angle(layer)
    },
    findAngle(pointA,pointB,pointC) {
        let angle_ab = Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x)
        let angle_cb = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x)
        let angle_abc = angle_ab - angle_cb
        return angle_abc
    },
    angle(points){
      // var angle = this.findAngle({x:points.x2,y:points.y2}, {x:this.facialPartPos[points.facialPart].x2,y:this.facialPartPos[points.facialPart].y2},{x:this.facialPartPos[points.facialPart].x1,y:this.facialPartPos[points.facialPart].y1})
      var angle = this.angleRadius(points) - this.angleRadius(this.facialPartPos[this.selectedCharacter][points.facialPart])
      return angle*( 180 /Math.PI);
    },
    angleRadius(points){
      return  Math.atan2( (points.y1-points.y2) , (points.x2-points.x1))
    },
    handleDragStart(e, layer) {
      this.dragStartEvent = {
        'x':e.target.x(),
        'y':e.target.y()
      }
    },
    handleDragEnter(e, layer) {
      this.dragStartEvent['x_enter'] = e.target.x()
      this.dragStartEvent['y_enter'] = e.target.y()

    },

    dragByOffset(offset_x, offset_y, idx){
      var x1_new = (this.form.layers[idx].x1 / 100 * this.FIXED_WH - offset_x) * 100 / this.FIXED_WH
      var y1_new = (this.form.layers[idx].y1 / 100 * this.FIXED_WH - offset_y) * 100 / this.FIXED_WH
      var x2_new = (this.form.layers[idx].x2 / 100 * this.FIXED_WH - offset_x) * 100 / this.FIXED_WH
      var y2_new = (this.form.layers[idx].y2 / 100 * this.FIXED_WH - offset_y) * 100 / this.FIXED_WH
      this.form.layers[idx].x1 = x1_new
      this.form.layers[idx].y1 = y1_new
      this.form.layers[idx].x2 = x2_new
      this.form.layers[idx].y2 = y2_new
      this.form.layers[idx] = this.recalculate(this.form.layers[idx])

      var node = this.$refs[this.form.layers[idx].name+'1'][0].getNode()
      console.log(node.x())
      console.log(offset_x)
      console.log(this.realX[this.form.layers[idx].name])

    },
    handleDragEnd(e, layer){
      const idx = this.form.layers.findIndex((r) => r.name === this.selectedShapeName);
      //脸

      var xFE_prev = this.dragStartEvent['x']
      var yFE_prev = this.dragStartEvent['y']
      var xFE_now = e.target.x();
      var yFE_now = e.target.y();

      console.log(e.target)

      var offset_x =  (xFE_now - xFE_prev)
      var offset_y =  (yFE_now - yFE_prev)

      this.dragByOffset(offset_x, offset_y, idx)

      this.realX[layer.name] = xFE_now
      this.realY[layer.name] = yFE_now
      this.form.layers[idx].realX =  xFE_now
      this.form.layers[idx].realY =  yFE_now


    },
    setRotationAndScale(idx, rotation, scale){
      var fpp = this.facialPartPos[this.selectedCharacter][this.form.layers[idx].facialPart]
      // this.form.layers[idx].x1 = fpp.x1
      // this.form.layers[idx].y1 = fpp.y1

      var realRotationRadius = -Konva.getAngle(rotation+1.3639)
      var distance = this.lineLength(fpp) / scale


      var x2 = this.form.layers[idx].x1 + distance * Math.cos(realRotationRadius)
      var y2 = this.form.layers[idx].y1 + distance * Math.sin(realRotationRadius)

      this.form.layers[idx].x2 = x2
      this.form.layers[idx].y2 = y2
      this.form.layers[idx] = this.recalculate(this.form.layers[idx])
    },
    rotate(layer){
      // this.form.layers[idx].x1 = fpp.x1
      // this.form.layers[idx].y1 = fpp.y1
      const idx = this.form.layers.findIndex((r) => r.name === layer.name);
      var rotation = this.rotationInput[layer.name]
      console.log(rotation)
      if(!rotation) rotation = 0
      var realRotationRadius = -Konva.getAngle(rotation)
      var distance = this.lineLength(layer)


      var x2 = this.form.layers[idx].x1 + distance * Math.cos(realRotationRadius)
      var y2 = this.form.layers[idx].y1 + distance * Math.sin(realRotationRadius)

      this.form.layers[idx].x2 = x2
      this.form.layers[idx].y2 = y2
      this.form.layers[idx] = this.recalculate(this.form.layers[idx])
      // this.$set(this.rotationInput,layer.name,this.form.layers[idx].rotationFE)
      // this.$set(this.scaleInput,layer.name,this.form.layers[idx].scaleFE)

    },
    setScale(layer){
      const idx = this.form.layers.findIndex((r) => r.name === layer.name);
      var fpp = this.facialPartPos[this.selectedCharacter][this.form.layers[idx].facialPart]
      // this.form.layers[idx].x1 = fpp.x1
      // this.form.layers[idx].y1 = fpp.y1
      var rotation = layer.rotationFE
      var scale = this.scaleInput[layer.name]
      if(!scale || scale <= 0) scale = 1
      var realRotationRadius = -Konva.getAngle(rotation)
      var distance = this.lineLength(fpp) / scale


      var x2 = this.form.layers[idx].x1 + distance * Math.cos(realRotationRadius)
      var y2 = this.form.layers[idx].y1 + distance * Math.sin(realRotationRadius)

      this.form.layers[idx].x2 = x2
      this.form.layers[idx].y2 = y2
      this.form.layers[idx] = this.recalculate(this.form.layers[idx])
      this.$set(this.rotationInput,layer.name,layer.rotationFE)
      this.$set(this.scaleInput,layer.name,layer.scaleFE)


    },
    handleTransformEnd(e) {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const idx = this.form.layers.findIndex((r) => r.name === this.selectedShapeName);

      // layer.scaleFE = this.lineLength({x1:organLeft_x,y1:organLeft_y,x2:organRight_x,y2:organRight_y}) / this.lineLength({x1:filterLeft_x,y1:filterLeft_y,x2:filterRight_x,y2:filterRight_y})
      //
      // var angle = ( 180 /Math.PI) *
      //   this.findAngle(
      //     {x:filterRight_x,y:filterRight_y},
      //     {x:organMid_x,y:organMid_y},
      //     {x:organRight_x,y:organRight_y}
      //   )
      // layer.rotationFE = -angle
      //
      //
      //
      this.setRotationAndScale(idx, e.target.rotation(), e.target.scaleX())
      this.$forceUpdate()
      this.rotationInput[this.form.layers[idx].name] = this.form.layers[idx].rotationFE
      this.scaleInput[this.form.layers[idx].name] = this.form.layers[idx].scaleFE

      console.log(this.recalculate(this.form.layers[idx]).rotationFE)
    },

  handleStageMouseDown(e) {
    // clicked on stage - clear selection
    for(var pos in this.facialPartValues){
      if(this.facialPartPos[this.selectedCharacter][this.facialPartValues[pos]]) {
        this.facialPartPos[this.selectedCharacter][this.facialPartValues[pos]].lineVisible = false
      }
    }
    this.form.layers = this.form.layers.map(l=>{l.lineVisible=false; return l})

    if (e.target === e.target.getStage()) {
      this.selectedShapeName = '';
      this.updateTransformer();
      return;
    }

    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    const rectIdx = this.form.layers.findIndex((r) => r.name === name);
    const rect = this.form.layers[rectIdx]

    if (rect) {
      this.selectedShapeName = name;
      this.facialPartPos[this.selectedCharacter][rect['facialPart']].lineVisible=true
      this.form.layers[rectIdx].lineVisible=true
    } else {
      this.selectedShapeName = '';
    }
    this.updateTransformer();
  },
  updateTransformer() {
    // here we need to manually attach or detach Transformer node
    const transformerNode = this.$refs.transformer.getNode();
    const stage = transformerNode.getStage();
    const { selectedShapeName } = this;

    const selectedNode = stage.findOne('.' + selectedShapeName);


    // do nothing if selected node is already attached
    if (selectedNode === transformerNode.node()) {
      return;
    }

    if (selectedNode) {
      // attach to another node
      transformerNode.nodes([selectedNode]);
    } else {
      // remove transformer
      transformerNode.nodes([]);
    }
  },
    lineLength(points){
      return Math.sqrt((points.x1-points.x2)*(points.x1-points.x2) + (points.y1-points.y2)*(points.y1-points.y2))
    },
    onSubmit() {
      this.refreshTag()
      updateOne(this.form).then(()=>this.onCancel())
    },
    refreshTag(){
      var tmpTagId = {}
      var tagWeight = {}
      if(this.form.filterTags) {
        this.form.filterTags.forEach(i => {
          tmpTagId[i['tag']] = i['id']
        })
        this.form.filterTags.forEach(i => {
          tagWeight[i['tag']] = i['weight']
        })
      }
      if(!tagWeight){
        tagWeight = {}
      }
      if(!tmpTagId){
        tmpTagId = {}
      }
      if(this.filterTagsView) {
        this.form.filterTags = this.filterTagsView.map(i => {
          if (i instanceof String || !i || !i['tags']) {
            return {'id': tmpTagId[i] ? tmpTagId[i] : null, 'tag': i, 'weight': tagWeight[i] ? tagWeight[i] : 0}
          } else {
            return i
          }
        })
      }
    },
    handleTagChange(){
      this.refreshTag()
    },
    onExport() {
      exportData(this.form)
    },
    handleChange(layer){
      this.form.layers = this.form.layers.slice()
      const idx = this.form.layers.findIndex((r) => r.name === layer.name);
      this.form.layers[idx] = this.recalculate(layer)

      // this.form.layers[idx].scaleYFE = this.form.layers[idx].scaleXFE
      // this.setRotationAndScale(idx, this.form.layers[idx].rotationFE, this.form.layers[idx].scaleXFE)
    },
    handleChangeT(layer){
      var tx = this.realX[layer.name]
      var ty = this.realY[layer.name]

      const idx = this.form.layers.findIndex((r) => r.name === layer.name);

      //脸
      var organLeft_x = this.FIXED_WH * (this.facialPartPos[this.selectedCharacter][layer.facialPart].x1) / 100
      var organLeft_y = this.FIXED_WH * (this.facialPartPos[this.selectedCharacter][layer.facialPart].y1) / 100
      var organRight_x = this.FIXED_WH * (this.facialPartPos[this.selectedCharacter][layer.facialPart].x2) / 100
      var organRight_y = this.FIXED_WH * (this.facialPartPos[this.selectedCharacter][layer.facialPart].y2) / 100
      var organMid_x = (organLeft_x + organRight_x) / 2
      var organMid_y = (organLeft_y + organRight_y) / 2
      //滤镜
      var filterLeft_x_prev = this.FIXED_WH * (layer.x1 - layer.offsetX) / 100
      var filterLeft_y_prev = this.FIXED_WH * (layer.y1 - layer.offsetY) / 100
      var filterRight_x_prev = this.FIXED_WH * (layer.x2 - layer.offsetX) / 100
      var filterRight_y_prev = this.FIXED_WH * (layer.y2 - layer.offsetY) / 100
      var filterMid_x_prev = (filterLeft_x_prev + filterRight_x_prev) / 2
      var filterMid_y_prev = (filterLeft_y_prev + filterRight_y_prev) / 2


      var xFE_prev = layer.realX
      var yFE_prev = layer.realY
      var xFE_now = tx
      var yFE_now = ty

      var offset_x =  (xFE_now - xFE_prev)
      var offset_y =  (yFE_now - yFE_prev)


      //
      var filterLeft_x_new = filterLeft_x_prev - offset_x;
      var filterLeft_y_new = filterLeft_y_prev - offset_y;
      var filterRight_x_new = filterRight_x_prev - offset_x
      var filterRight_y_new = filterRight_y_prev - offset_y
      var filterMid_x_new = (filterLeft_x_new + filterRight_x_new) / 2
      var filterMid_y_new = (filterLeft_y_new + filterRight_y_new) / 2




      var adjust_x = filterMid_x_new - organMid_x
      var adjust_y = filterMid_y_new - organMid_y

      var x1_new = (this.form.layers[idx].x1 / 100 * this.FIXED_WH - offset_x) * 100 / this.FIXED_WH
      var y1_new = (this.form.layers[idx].y1 / 100 * this.FIXED_WH - offset_y) * 100 / this.FIXED_WH
      var x2_new = (this.form.layers[idx].x2 / 100 * this.FIXED_WH - offset_x) * 100 / this.FIXED_WH
      var y2_new = (this.form.layers[idx].y2 / 100 * this.FIXED_WH - offset_y) * 100 / this.FIXED_WH


      // this.form.layers[idx].originXFE = filterMid_x_new
      // this.form.layers[idx].originYFE = filterMid_y_new

      // this.form.layers[idx].xFE = filterMid_x_new - adjust_x
      // this.form.layers[idx].yFE =  filterMid_y_new - adjust_y


      layer.x1 = x1_new
      layer.y1 = y1_new
      layer.x2 = x2_new
      layer.y2 = y2_new
      console.log(y2_new)
      // this.form.layers[idx] = this.recalculate(layer)

      // var distance = this.lineLength({x1:organLeft_x,y1:organLeft_y,x2:organRight_x,y2:organRight_y}) / layer.scaleFE
      // var realRotationRadius = -this.angle(this.form.layers[idx])
      // this.form.layers[idx].x2 = this.form.layers[idx].x1 + distance * Math.cos(realRotationRadius)
      // this.form.layers[idx].y2 = this.form.layers[idx].y1 + distance * Math.sin(realRotationRadius)
      this.form.layers[idx] = this.recalculate(layer)
      this.form.layers[idx].realX=tx
      this.form.layers[idx].realY=ty

    },
    handleChangeTY(layer){
      this.form.layers = this.form.layers.slice()
      const idx = this.form.layers.findIndex((r) => r.name === layer.name);
      this.form.layers[idx].y1 += layer.ty
      this.form.layers[idx].y2 += layer.ty

      this.form.layers[idx] = this.recalculate(layer)
    },
    handleChangeOffset(layer){
      this.form.layers = this.form.layers.slice()
      const idx = this.form.layers.findIndex((r) => r.name === layer.name);
      this.form.layers[idx] = this.recalculate(layer)
      // this.form.layers[idx].xFE += this.form.layers[idx].offsetX * this.FIXED_WH / 100
      // this.form.layers[idx].yFE += this.form.layers[idx].offsetY * this.FIXED_WH / 100
      // this.setRotationAndScale(idx, this.form.layers[idx].rotationFE, this.form.layers[idx].scaleXFE)
    },
    reset() {
      this.form={
        layers: [],
      }
    },
    onCancel() {
      this.$router.back(-1)
    },
    fetchData(id) {
              // queryAristsList({size:99999}).then(res=>this.artists = res)
      // getAvailableTags().then(response=>{
      //   this.availableTags =response
      // })
      if(id){
        this.listLoading = true
        getById(id).then(res=>{this.listLoading = false;
          // this.filterTagsView = res.filterTags.map(i => {
          //   return i.tag
          // })
          if(!res['params']) res['params']=""
          try {
            res.paramsObj = JSON.parse(res['params'])
          }catch (e){
            console.log(res['params'])
            console.log(e)
          }
          if(res.paramsObj === null || res.paramsObj === ''){
            res.paramsObj = {
              'durations': []
            }
          }
          if(!res.layers){res.layers = []}
          this.imagesToLoad = res.layers.length
            this.form=res;
            this.form.layers = this.form.layers.map((layer,idx)=>{

              layer = this.recalculate(layer)
              this.$set(this.rotationInput,layer.name,layer.rotationFE)
              this.$set(this.scaleInput,layer.name,layer.scaleFE)

              layer.z = idx+1
              return layer
            })
        })

      }else{

      }
    },

    recalculate(layer){
      // layer.xFE= (layer.x1 + layer.offsetX*2 + layer.x2) * this.FIXED_WH / 100
      // layer.yFE= (layer.y1 + layer.offsetY*2 + layer.y2) * this.FIXED_WH / 100
      // layer.scaleXFE= this.scale(layer)
      // layer.scaleYFE= layer.scaleXFE
      // layer.rotationFE = this.rotation(layer)
      // console.log(layer)


      //脸
      var organLeft_x = this.FIXED_WH * (this.facialPartPos[this.selectedCharacter][layer.facialPart].x1) / 100
      var organLeft_y = this.FIXED_WH * (this.facialPartPos[this.selectedCharacter][layer.facialPart].y1) / 100
      var organRight_x = this.FIXED_WH * (this.facialPartPos[this.selectedCharacter][layer.facialPart].x2) / 100
      var organRight_y = this.FIXED_WH * (this.facialPartPos[this.selectedCharacter][layer.facialPart].y2) / 100
      var organMid_x = (organLeft_x + organRight_x) / 2
      var organMid_y = (organLeft_y + organRight_y) / 2

      //滤镜
      var filterLeft_x = this.FIXED_WH * (layer.x1 + layer.offsetX) / 100
      var filterLeft_y = this.FIXED_WH * (layer.y1 + layer.offsetY) / 100
      var filterRight_x = this.FIXED_WH * (layer.x2 + layer.offsetX) / 100
      var filterRight_y = this.FIXED_WH * (layer.y2 + layer.offsetY) / 100
      var filterMid_x = (filterLeft_x + filterRight_x) / 2
      var filterMid_y = (filterLeft_y + filterRight_y) / 2
      layer.filterMidX = filterMid_x
      layer.filterMidY = filterMid_y

      layer.scaleFE = this.lineLength({x1:organLeft_x,y1:organLeft_y,x2:organRight_x,y2:organRight_y}) / this.lineLength({x1:filterLeft_x,y1:filterLeft_y,x2:filterRight_x,y2:filterRight_y})
      var adjust_x = filterMid_x - organMid_x
      var adjust_y = filterMid_y - organMid_y

      layer.originXFE = filterMid_x
      layer.originYFE = filterMid_y
      layer.xFE = organMid_x
      layer.yFE =  organMid_y
      filterMid_x = organMid_x
      filterMid_y = organMid_y
      filterRight_y -=adjust_y
      filterRight_x -=adjust_x
      filterLeft_y -=adjust_y
      filterLeft_x -=adjust_x


      var angle = ( 180 /Math.PI) *
        this.findAngle(
          {x:filterRight_x,y:filterRight_y},
          {x:organMid_x,y:organMid_y},
          {x:organRight_x,y:organRight_y}
      )
      layer.rotationFE = -angle

      if(!layer.rotation) {
        layer.rotation = -angle
      }

      if(!layer.scale) {
        layer.scale = layer.scaleFE
      }

      if(!layer.realX) {
        this.$set(this.realX,layer.name, -adjust_x)
        this.$set(this.realY,layer.name, -adjust_y)
        layer.realX = -adjust_x
        layer.realY = -adjust_y
      }
        // var angle = this.findAngle({x:filterRight_x,y:filterRight_y},{x:organMid_x,y:organMid_y},{x:organRight_x,y:organRight_y}) *( 180 /Math.PI)






      return layer
    },

    rotateAroundCenter(node, rotation) {
      const rotatePoint = ({ x, y }, rad) => {
        const rcos = Math.cos(rad);
        const rsin = Math.sin(rad);
        return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
      };

     //current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
      const topLeft = { x: -node.width() / 2, y: -node.height() / 2 };
      const current = rotatePoint(topLeft, Konva.getAngle(node.rotation()));
      const rotated = rotatePoint(topLeft, Konva.getAngle(rotation));
      const dx = rotated.x - current.x,
        dy = rotated.y - current.y;

      node.rotation(rotation);
      node.x(node.x() + dx);
      node.y(node.y() + dy);
    },

    handleAvatarSuccess(res, file) {
      this.form.icon = file.response.fileDownloadPath;
      this.$forceUpdate()
    },
    handlePreviewCoverImageSuccess(res, file) {
      this.form.previewCoverImage = file.response.fileDownloadPath;
      this.$forceUpdate()
    },
    handlePreviewVideoSuccess(res, file) {
      this.form.previewVideo = file.response.fileDownloadPath;
      this.$forceUpdate()
    },
    handleBackgroundImageSuccess(res, file){
      this.form.backgroundImage = file.response.fileDownloadPath
      this.$forceUpdate()
    },
    handleRowSuccess(i,res, file) {
      this.form.layers[i].image = file.response.fileDownloadPath;
      this.handleFacialPartChange(this.form.layers[i])
      this.form.layers[i] = this.recalculate(this.form.layers[i])
      this.form.layers = this.form.layers.slice()
      this.$forceUpdate()
    },
    handleRowRemove(i,res, file) {
      this.form.layers[i].image = null
      this.$forceUpdate()
    },
    beforeAvatarUpload(file) {
      return true
    },
    newLayer(){
      let maxId = this.form.layers ? this.form.layers.length + 1 : 0
      var layer = {z:maxId, image:null, x1: 41.5,y1:49.5,x2:57.5,y2:49,rotationFE:0, scaleFE:1, offsetX:0,offsetY:0,name:'层'+maxId,facialPart:'outerLips'}
      this.form.layers.push(layer)
      this.handleLayerNameChange(layer)
      var fpp = this.facialPartPos[this.selectedCharacter][layer.facialPart]

      var angle = ( 180 /Math.PI) *
        this.findAngle(
          {x:fpp.x2,y:fpp.y1},
          {x:fpp.x1,y:fpp.y1},
          {x:fpp.x2,y:fpp.y2}
        )
      layer.rotationFE = angle
      this.$set(this.rotationInput,layer.name,layer.rotationFE)

      this.rotate(layer)
      this.setScale(layer)
      this.rotate(layer)



      this.$forceUpdate()
    },
    delRow(idx,row){
      this.apng[this.form.layers[idx].name]=null

      this.form.layers.splice(idx, 1);
      this.form.layers.map((val,idx)=>this.form.layers[idx].z=idx+1)
      // this.form.songs =
    },
    genImage(img, local) {
      if (!img) return null
      var src = null
      if (local) {
        src = localUrl + img;
      } else {
        src = img;
      }
      var image = new window.Image();
      image.src = src
      // image.onload = () => {
      //   // set image only when it is loaded
      //   this.imagesToLoad -= 1
      //   // ;
      // };
      return image
    },

    moveUp(idx, row){
      this.form.layers = this.move(this.form.layers, idx, idx-1)
      this.form.layers.map((val,idx)=>this.form.layers[idx].z=idx+1)
    },

    moveDown(idx, row){
      this.form.layers = this.move(this.form.layers, idx, idx+1)
      this.form.layers.map((val,idx)=>this.form.layers[idx].z=idx+1)
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
        arr[i].z = i
      }
      return arr
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.thumb {
  width: 100px;
  height: 100px;
  display: block;
}
.thumb-uploader-icon {
  width: 100px;
  height: 100px;
  display: block;
}
.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  display: block;
}

/*.el-input-number--mini{*/
/*  width: 100px!important;*/
/*}*/
</style>

