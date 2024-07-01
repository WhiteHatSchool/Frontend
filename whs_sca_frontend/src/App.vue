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
      <p>Projectname v0.1</p>
    </footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue'; // Import the Footer component

export default {
  name: 'App',
  components: {
    NavBar,
    Footer // Register the Footer component
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
  width: 250px; /* Sidebar width */
  height: 100%;
}

.content-wrapper {
  margin-left: 250px; /* Sidebar width */
  padding: 20px;
  background-color: #ecf0f1; /* 배경색 설정 */
  min-height: calc(100vh - 40px); /* Adjust for footer height */
  display: flex;
  flex-direction: column;
  width: calc(100% - 250px); /* Adjust for sidebar width */
  box-sizing: border-box;
}

main {
  flex-grow: 1;
}

footer {
  text-align: right;
  color: #2c3e50;
  padding: 5px 20px 5px 0; /* Add right padding */
  position: fixed;
  bottom: 0;
  width: calc(100% - 250px); /* Adjust for sidebar width */
  left: 250px; /* Sidebar width */
  background-color: transparent;
}
</style>
