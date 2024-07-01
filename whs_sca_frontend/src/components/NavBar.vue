<template>
  <div id="navbar">
    <nav class="sidebar">
      <div class="logo-container">
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo.png" alt="Logo" class="logo">
          <span class="project-name">ProjectName</span>
        </router-link>
      </div>
      <hr class="divider">
      <ul>
        <li><router-link to="/" class="nav-link">Project</router-link></li>
        <li><router-link to="/history" class="nav-link">History</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
};
</script>

<style scoped>
#navbar {
  display: flex;
  flex-direction: column;
}

.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ecf0f1;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.project-name {
  font-size: 20px;
  font-weight: bold;
}

.divider {
  border-top: 1px solid #ecf0f1;
  margin: 20px 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 18px;
  display: block;
  padding: 10px 15px;
  margin: 5px 0;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.nav-link:hover {
  background-color: #202C39; /* 어두운 배경색 */
  transform: scale(1.05); /* 커지는 효과 */
}
</style>
