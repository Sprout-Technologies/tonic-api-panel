<template>
  <div style="display: flex">
    <el-select v-model="selectedValue" placeholder="请选择" @change="handleSelectChange">
      <slot></slot>
    </el-select>
    <el-input v-if="showInput" v-model="inputValue" placeholder="自定义输入" @input="handleInputChange" style="width: 240px;margin-left: 20px;"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number, Object],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedValue: this.value,
      inputValue: this.getLabelForValue(this.value),
      showInput: false
    }
  },
  methods: {
    getLabelForValue(value) {
      const option = this.options.find(opt => JSON.stringify(opt.value) === JSON.stringify(value))
      return option ? option.label : value
    },
    handleSelectChange(value) {
      this.showInput = true
      this.inputValue = this.getLabelForValue(value)
      this.$emit('input', value)
    },
    handleInputChange(value) {
      this.$emit('input', value)
    }
  },
  watch: {
    value(newVal) {
      this.selectedValue = newVal
      this.inputValue = this.getLabelForValue(newVal)
    }
  }
}
</script>
