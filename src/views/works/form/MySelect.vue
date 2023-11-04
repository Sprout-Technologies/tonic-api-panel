<template>
  <el-select v-model="model" placeholder="请选择">
    <el-option
      v-for="(optionValue, optionKey) in options"
      :key="optionKey"
      :label="optionKey"
      :value="optionValue">
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
        return this.value;
      },
      set(newValue) {
        this.$emit('input', newValue);
      }
    }
  },
  created() {
    console.log('initial input value:', this.value)
    console.log('initial options:', this.options)
  }
}
</script>
