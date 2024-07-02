<template>
  <div class="dashboard">
    <h1>{{ project.name }}</h1>
    <div class="tab-menu">
      <router-link :to="{ name: 'CodeDashboard', params: { repoId: repoId } }" class="tab" :class="{ active: $route.name === 'CodeDashboard' }">Code</router-link>
      <router-link :to="{ name: 'ServerDashboard', params: { repoId: repoId } }" class="tab" :class="{ active: $route.name === 'ServerDashboard' }">Server</router-link>
    </div>
    <div class="content">
      <div class="unused-list">
        <h2>Unused Import List</h2>
        <textarea readonly>{{ project.unused_import_list.join('\n') }}</textarea>
      </div>
      <div class="unused-list">
        <h2>Unused Package</h2>
        <textarea readonly>{{ project.unused_package.join('\n') }}</textarea>
      </div>
      <div class="dependency-list">
        <h2>Dependency List</h2>
        <div class="dependency">
          <div class="dependency-section existing-code">
            <h3>Existing Code</h3>
            <div class="status">
              <div class="status-header">
                <div class="status-box">
                  <span class="vuln-title">Vulnerability</span>
                  <span class="vuln-value">{{ project.dependency_list.before.vuln_lists.length }}</span>
                </div>
                <div class="status-box">
                  <span class="cvss-title">CVSS score</span>
                  <span class="cvss-value">{{ project.dependency_list.before.cvss }}</span>
                </div>
              </div>
              <div class="severity-counts">
                <div class="severity-item">
                  <div class="severity-box critical">critical<br>{{ countSeverity(project.dependency_list.before.vuln_lists, 'Critical') }}</div>
                </div>
                <div class="severity-item">
                  <div class="severity-box high">high<br>{{ countSeverity(project.dependency_list.before.vuln_lists, 'High') }}</div>
                </div>
                <div class="severity-item">
                  <div class="severity-box medium">medium<br>{{ countSeverity(project.dependency_list.before.vuln_lists, 'Medium') }}</div>
                </div>
                <div class="severity-item">
                  <div class="severity-box low">low<br>{{ countSeverity(project.dependency_list.before.vuln_lists, 'Low') }}</div>
                </div>
                <div class="severity-item">
                  <div class="severity-box unassigned">unassigned<br>{{ countSeverity(project.dependency_list.before.vuln_lists, 'Unassigned') }}</div>
                </div>
              </div>
            </div>
            <table class="dependency-table">
              <thead>
                <tr>
                  <th>Components</th>
                  <th>Version</th>
                  <th>Vulnerability</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="component in project.dependency_list.before.vuln_lists" :key="component.component_name" @click="navigateTo(component.vulnerability_code)" class="clickable-row">
                  <td>{{ component.component_name }}</td>
                  <td>{{ component.ver }}</td>
                  <td><a :href="component.vulnerability_code">{{ component.vulnerability_code }}</a></td>
                  <td>{{ component.severity }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="dependency-section remaining-code">
            <h3>Removing Unused Code</h3>
            <div class="status">
              <div class="status-header">
                <div class="status-box">
                  <span class="vuln-title">Vulnerability</span>
                  <span class="vuln-value">{{ project.dependency_list.after.vuln_lists.length }}</span>
                </div>
                <div class="status-box">
                  <span class="cvss-title">CVSS score</span>
                  <span class="cvss-value">{{ project.dependency_list.after.cvss }}</span>
                </div>
              </div>
              <div class="severity-counts">
                <div class="severity-item">
                  <div class="severity-box critical">critical<br>{{ countSeverity(project.dependency_list.after.vuln_lists, 'Critical') }}</div>
                </div>
                <div class="severity-item">
                  <div class="severity-box high">high<br>{{ countSeverity(project.dependency_list.after.vuln_lists, 'High') }}</div>
                </div>
                <div class="severity-item">
                  <div class="severity-box medium">medium<br>{{ countSeverity(project.dependency_list.after.vuln_lists, 'Medium') }}</div>
                </div>
                <div class="severity-item">
                  <div class="severity-box low">low<br>{{ countSeverity(project.dependency_list.after.vuln_lists, 'Low') }}</div>
                </div>
                <div class="severity-item">
                  <div class="severity-box unassigned">unassigned<br>{{ countSeverity(project.dependency_list.after.vuln_lists, 'Unassigned') }}</div>
                </div>
              </div>
            </div>
            <table class="dependency-table">
              <thead>
                <tr>
                  <th>Components</th>
                  <th>Version</th>
                  <th>Vulnerability</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="component in project.dependency_list.after.vuln_lists" :key="component.component_name" @click="navigateTo(component.vulnerability_code)" class="clickable-row">
                  <td>{{ component.component_name }}</td>
                  <td>{{ component.ver }}</td>
                  <td><a :href="component.vulnerability_code">{{ component.vulnerability_code }}</a></td>
                  <td>{{ component.severity }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeDashboard',
  props: ['repoId'],
  data() {
    return {
      project: {
        name: '',
        unused_import_list: [],
        unused_package: [],
        dependency_list: {
          before: {
            cvss: 0,
            vuln_lists: []
          },
          after: {
            cvss: 0,
            vuln_lists: []
          }
        }
      }
    };
  },
  created() {
    this.fetchProjectData();
  },
  methods: {
    async fetchProjectData() {
      try {
        const response = await fetch(`http://113.198.229.153:107/api/project/${this.repoId}/code`);
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        const data = await response.json();
        this.project = data;
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    },
    countSeverity(vulnLists, severity) {
      return vulnLists.filter(vul => vul.severity === severity).length;
    },
    navigateTo(url) {
      window.open(url, '_blank');
    }
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

.unused-list, .dependency-list {
  margin-bottom: 20px;
}

.unused-list h2, .dependency-list h2 {
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  height: 100px;
  resize: vertical;
  padding: 10px;
  border: 2px solid #2c3e50;
  border-radius: 5px;
  background-color: #ffffff;
  color: #2c3e50;
}

.dependency {
  display: flex;
  justify-content: space-between;
}

.dependency-section {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  border: 2px solid #2c3e50;
  border-radius: 5px;
  background-color: #FFFFFF;
  color: #2c3e50;
}

.dependency-section:last-child {
  margin-right: 0;
}

.status {
  background-color: #ecf0f1;
  border: 2px solid #2c3e50;
  padding: 10px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  width: calc(100% / 2 - 10px); /* 가로 길이 통일 */
  text-align: center;
}

.status-body {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.vuln-title, .cvss-title {
  margin: 0;
  font-weight: bold;
}

.vuln-value, .cvss-value {
  margin: 0;
  font-size: 1.5em;
}

.severity-counts {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.severity-item {
  flex: 1;
}

.severity-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #2c3e50;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.critical {
  color: #ff4d4d; /* 붉은색 */
}

.high {
  color: #ffa500; /* 주황색 */
}

.medium {
  color: #ffd700; /* 황금색 */
}

.low {
  color: #9370db; /* 파란색 */
}

.unassigned {
  color: #32cd32; /* 초록색 */
}

.dependency-table {
  margin-top: 10px;
  width: 100%;
  border-collapse: collapse;
}

.dependency-table th, .dependency-table td {
  border: 1px solid #2c3e50;
  padding: 8px;
  text-align: left;
}

.dependency-table th {
  background-color: #ffffff;
  color: #2c3e50;
}

.dependency-table td a {
  color: #2c3e50;
  text-decoration: none;
}

.dependency-table td a:hover {
  text-decoration: underline;
}

.dependency-table .clickable-row:hover {
  background-color: #ecf0f1;
  cursor: pointer;
}
</style>
