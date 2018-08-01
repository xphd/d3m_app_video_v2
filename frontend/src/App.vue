<template>
<div id="app">
    <h1>App Root</h1>
    <RawVideoView></RawVideoView>
</div>
</template>

<script>
import RawVideoView from "./components/RawVideoView.vue";
export default {
  name: "app",
  components: {
    RawVideoView
  }
};
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
