<template>
  <div class="dashboard">
    <h1>{{ project.name }}</h1>
    <div class="tab-menu">
      <router-link :to="{ name: 'CodeDashboard', params: { repoId: repoId } }" class="tab" :class="{ active: $route.name === 'CodeDashboard' }">Code</router-link>
      <router-link :to="{ name: 'ServerDashboard', params: { repoId: repoId } }" class="tab" :class="{ active: $route.name === 'ServerDashboard' }">Server</router-link>
    </div>
    <div class="content">
      <div class="vulnerability-board">
        <div class="vulnerability-table">
          <div class="vulnerability-row header">
            <div class="vulnerability-cell">Title</div>
            <div class="vulnerability-cell">Description</div>
            <div class="vulnerability-cell">Affected Packages</div>
            <div class="vulnerability-cell">Recommendation</div>
          </div>
          <div v-for="(vulnerability, index) in paginatedVulnerabilities" :key="index" class="vulnerability-row">
            <div class="vulnerability-cell">{{ vulnerability.title }}</div>
            <div class="vulnerability-cell">{{ vulnerability.description }}</div>
            <div class="vulnerability-cell">
              <div class="affected-package" v-for="pkg in vulnerability.affectedPackages" :key="pkg">{{ pkg }}</div>
            </div>
            <div class="vulnerability-cell">
              <div v-for="link in parseLinks(vulnerability.recommendation)" :key="link" class="recommendation-link">
                <a :href="link" target="_blank">{{ link }}</a>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
          <button v-for="page in paginationPages" :key="page" @click="setPage(page)" :class="{ active: currentPage === page }">{{ page }}</button>
          <button @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServerDashboard',
  props: ['repoId'],
  data() {
    return {
      project: {
        name: '',
        vulnerabilities: []
      },
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.project.vulnerabilities.length / this.itemsPerPage);
    },
    paginatedVulnerabilities() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.project.vulnerabilities.slice(start, end);
    },
    paginationPages() {
      const pages = [];
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, this.currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (startPage > 1) {
        pages.unshift(1);
        if (startPage > 2) pages.splice(1, 0, '...');
      }

      if (endPage < this.totalPages) {
        pages.push(this.totalPages);
        if (endPage < this.totalPages - 1) pages.splice(pages.length - 1, 0, '...');
      }

      return pages;
    }
  },
  methods: {
    async fetchProjectData() {
      try {
        const response = await fetch(`http://43.201.110.185:8000/api/project/${this.repoId}/server`);
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        this.project.name = data.name;
        this.project.vulnerabilities = data.findings;
        console.log('Vulnerabilities:', this.project.vulnerabilities);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    },
    setPage(page) {
      if (page === '...') return;
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    parseLinks(recommendation) {
      const regex = /\[([^\]]+)\]\([^\)]+\)/g;
      let matches;
      const links = [];
      while ((matches = regex.exec(recommendation)) !== null) {
        links.push(matches[1]);
      }
      return links;
    }
  },
  created() {
    this.fetchProjectData();
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  box-sizing: border-box;
  color: #2c3e50;
}

h1 {
  margin-top: 50px;
  color: #2c3e50;
  position: relative;
  padding-bottom: 10px;
  text-align: center;
}

h1:after {
  content: "";
  display: block;
  width: 50px;
  height: 2px;
  background: #2c3e50;
  margin: 10px auto 0;
}

.tab-menu {
  display: flex;
  border-bottom: 2px solid #2c3e50;
}

.tab {
  padding: 10px 20px;
  text-decoration: none;
  color: #2c3e50;
}

.tab.active {
  font-weight: bold;
  border-bottom: 2px solid #2c3e50;
}

.content {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vulnerability-board {
  margin-bottom: 20px;
}

.vulnerability-header {
  margin-bottom: 10px;
  font-size: 1.2em;
  font-weight: bold;
}

.vulnerability-table {
  display: flex;
  flex-direction: column;
}

.vulnerability-row {
  display: flex;
  border-bottom: 1px solid #2c3e50;
  padding: 10px 0;
}

.vulnerability-row.header {
  font-weight: bold;
  background-color: #ecf0f1;
}

.vulnerability-cell {
  flex: 1;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommendation-link a {
  display: block;
}

.affected-package {
  display: inline-block;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  background-color: transparent;
  color: #2c3e50;
  cursor: pointer;
}

.pagination button.active {
  font-weight: bold;
  text-decoration: underline;
}

.pagination button:disabled {
  color: #d3d3d3;
  cursor: not-allowed;
}
</style>
