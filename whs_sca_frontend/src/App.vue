<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <div class="content-wrapper">
      <div class="content">
        <router-view />
      </div>
    </div>
    <footer>
      <p>WHSCA v1.0</p>
    </footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  }
};
</script>

<style>
body, html, #app {
  height: 100%;
  margin: 0;
  background-color: #ecf0f1;
}

header {
  position: fixed;
  width: 250px;
  height: 100%;
}

.content-wrapper {
  margin-left: 250px;
  padding: 20px;
  background-color: #ecf0f1;
  min-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  width: calc(100% - 250px);
  box-sizing: border-box;
}

main {
  flex-grow: 1;
}

footer {
  text-align: right;
  color: #2c3e50;
  padding: 5px 20px 5px 0;
  position: fixed;
  bottom: 0;
  width: calc(100% - 250px);
  right: 30px;
  background-color: transparent;
}
</style>
