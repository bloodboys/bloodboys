<template>
    <div>
       <el-button type="info" @click='logout'>退出</el-button>
    </div>
</template>

<script>
export default {
  methods: {
    logout () {
      localStorage.removeItem('csn')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
