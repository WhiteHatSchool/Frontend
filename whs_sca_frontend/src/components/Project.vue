<template>
  <div class="repository">
    <h1>Project</h1>
    <div class="repo-list">
      <div class="repo-card" v-for="repo in repos" :key="repo.id" @click="goToCodeDashboard(repo.id)">
        <div class="repo-info">
          <h2>{{ repo.name }}</h2>
          <p>ver. {{ repo.version }}</p>
        </div>
        <div class="repo-date">{{ repo.date }}</div>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Project',
  data() {
    return {
      repos: [],
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 1
    };
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      console.log(`Fetching projects for page ${this.currentPage}`);
      try {
        const response = await fetch(`http://43.201.110.185:8000/api/project/?page=${this.currentPage}&cnt_per_page=${this.itemsPerPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        this.repos = data.projects.reverse();
        this.totalPages = data.sum_of_page;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    goToCodeDashboard(repoId) {
      this.$router.push({ name: 'CodeDashboard', params: { repoId } });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchProjects();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchProjects();
      }
    },
    goToPage(page) {
      console.log(`Navigating to page ${page}`);
      this.currentPage = page;
      this.fetchProjects();
    }
  }
};
</script>

<style scoped>
body {
  background-color: #ecf0f1;
}

.repository {
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

.repo-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.repo-card {
  border: 2px solid #2c3e50;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 850px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  cursor: pointer;
}

.repo-card:hover {
  background-color: #dfe6e9;
  transform: scale(1.02);
}

.repo-info {
  flex-grow: 1;
  text-align: left;
}

.repo-info h2 {
  margin: 0;
  color: #2c3e50;
}

.repo-info p {
  margin: 0;
  color: #7f8c8d;
}

.repo-date {
  color: #bdc3c7;
}

.pagination {
  margin-top: 20px;
}

.pagination button {
  border: none;
  background-color: transparent;
  color: #2c3e50;
  margin: 0 5px;
  cursor: pointer;
  font-size: 1em;
}

.pagination button.active {
  font-weight: bold;
  text-decoration: underline;
}

.pagination button:disabled {
  color: #bdc3c7;
  cursor: not-allowed;
}
</style>
