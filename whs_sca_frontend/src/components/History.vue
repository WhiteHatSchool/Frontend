<template>
  <div class="history">
    <main>
      <h1>History</h1>
      <div class="project-list-wrapper">
        <ul class="project-list">
          <li v-for="project in projects" :key="project.id" @click="goToHistory2(project.name)">
            <div class="project-card">
              <div class="project-name"><strong>{{ project.name }}</strong></div>
              <div class="project-date">Last analyzed on {{ project.lastAnalyzed }}</div>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'History',
  data() {
    return {
      projects: []
    };
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await fetch(`http://113.198.229.153:107/api/project/`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        this.projects = data.projects;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    goToHistory2(projectName) {
      this.$router.push({ name: 'History2', params: { projectName } });
    }
  },
  created() {
    this.fetchProjects();
  }
};
</script>

<style scoped>
body {
  color: #2c3e50;
  font-family: Arial, sans-serif;
}

.history {
  padding: 20px;
  text-align: center;
}

h1 {
  margin-top: 50px;
  color: #2c3e50;
  position: relative;
  padding-bottom: 10px;
}

h1:after {
  content: "";
  display: block;
  width: 50px;
  height: 2px;
  background: #2c3e50;
  margin: 10px auto 0;
}

.project-list-wrapper {
  max-width: 850px;
  margin: 0 auto;
  border-radius: 8px;
  padding: 20px;
}

.project-list {
  list-style-type: none;
  padding: 0;
}

.project-list li {
  background: #ffffff;
  padding: 20px;
  margin: 10px 0;
  border: 2px solid #2c3e50;
  border-radius: 4px;
  text-align: left;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  color: #2c3e50;
}

.project-list li:hover {
  background-color: #b0bec5;
  transform: scale(1.02);
}

.project-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
}

.project-name {
  text-align: left;
}

.project-date {
  text-align: right;
}
</style>
