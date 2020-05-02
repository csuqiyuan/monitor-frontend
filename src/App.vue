<template>
  <div id="app">
      <el-container>
          <Aside></Aside>
          <MainPage></MainPage>
      </el-container>

  </div>
</template>

<script>

import Aside from "@/common/Aside";
import MainPage from "@/common/MainPage";
export default {
  name: 'App',
  components: {
      Aside,
      MainPage

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
