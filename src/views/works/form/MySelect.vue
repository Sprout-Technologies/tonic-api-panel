<template>
  <el-select v-model="model" placeholder="请选择">
    <el-option
      v-for="(optionValue, optionKey) in options"
      :key="optionKey"
      :label="optionKey"
      :value="optionKey">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  computed: {
    model: {
      get() {
        return Object.keys(this.options).find(key => this.options[key] === this.value)
      },
      set(newKey) {
        this.$emit('input', this.options[newKey])
      }
    }
  },
  created() {
    console.log('initial input value:', this.value)
    console.log('initial options:', this.options)
  }
}
</script>
