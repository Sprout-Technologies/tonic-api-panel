<template>
  <el-select v-model="selectedKey" :placeholder="placeholder">
    <el-option v-for="(value, key) in options" :key="key" :label="key" :value="key">
      {{key}}
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value', 'options', 'placeholder'],
  computed: {
    selectedKey: {
      get() {
        return Object.keys(this.options).find(key => {
          return this.options[key] === this.value;
        });
      },
      set(key) {
        this.$emit('input', this.options[key]);
      }
    }
  }
}
</script>
