<template>
  <el-container>
    <el-main>
      <el-table :data="pushList" style="width: 100%">
        <el-table-column prop="id" label="配置ID (UUID)" width="250"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="subTitle" label="副标题" width="180"></el-table-column>
        <el-table-column prop="body" label="内容"></el-table-column>
        <el-table-column prop="createdAt" label="推送时间" width="200">
          <template slot-scope="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="操作" width="200">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handlePushDetail(row.id)">查看详情</el-button>
          </template>
        </el-table-column>
        <!-- 其他列... -->
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { getAllPush } from '@/api/push'
export default {
  data() {
    return {
      pushList: [] // 存放从API获取的推送数据列表
    }
  },
  async created() {
    await this.fetchPushList()
  },
  methods: {
    async fetchPushList() {
      // 假设getAllPush是API调用方法
      getAllPush().then(response => {
        // 假设返回的数据结构符合您提供的样式
        this.pushList = response.content
      }).catch(error => {
        this.$message.error('获取推送列表失败')
      })
    },
    handlePushDetail(id) {
      this.$router.push({ path: '/pushTools/pushDetail', query: { id: id }})
    },
    formatDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }
  }
}
</script>
