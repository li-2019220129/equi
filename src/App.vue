<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  watch: {
    "$store.state.login.loginData": {
      handler(newValue, oldValue) {
        console.log(newValue, "0000");
        console.log(oldValue, "1111");
      },
    },
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
}
</style>
