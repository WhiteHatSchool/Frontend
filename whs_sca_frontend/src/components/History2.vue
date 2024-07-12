<template>
  <div class="history-detail">
    <main>
      <h1>{{ project.name }}</h1>
      <div class="project-summary">
        <p>Last analyzed on {{ project.lastAnalyzed }}</p>
      </div>
      <div class="dashboard-info">
        <div class="info-title">PROJECT SUMMARIZE (ver.{{ mostRecentVersion.version }})</div>
        <canvas id="vulnerabilityChart"></canvas>
        <div class="vulnerability-info">
          <div class="vulnerability-box">
            <span class="critical">CRITICAL</span><br><span class="percentage">{{ mostRecentVersion.critical }}</span>
          </div>
          <div class="vulnerability-box">
            <span class="high">HIGH</span><br><span class="percentage">{{ mostRecentVersion.high }}</span>
          </div>
          <div class="vulnerability-box">
            <span class="medium">MEDIUM</span><br><span class="percentage">{{ mostRecentVersion.medium }}</span>
          </div>
          <div class="vulnerability-box">
            <span class="low">LOW</span><br><span class="percentage">{{ mostRecentVersion.low }}</span>
          </div>
          <div class="vulnerability-box">
            <span class="unassigned">UNASSIGNED</span><br><span class="percentage">{{ mostRecentVersion.unassigned }}</span>
          </div>
        </div>
      </div>
      <div v-for="(version, index) in previousVersions" :key="index" class="previous-version">
        <div class="version-header">
          <span>ver.{{ version.version }}</span>
        </div>
        <div class="vulnerability-info">
          <div class="vulnerability-box">
            <span class="critical">CRITICAL</span><br><span class="percentage">{{ version.critical }}</span>
          </div>
          <div class="vulnerability-box">
            <span class="high">HIGH</span><br><span class="percentage">{{ version.high }}</span>
          </div>
          <div class="vulnerability-box">
            <span class="medium">MEDIUM</span><br><span class="percentage">{{ version.medium }}</span>
          </div>
          <div class="vulnerability-box">
            <span class="low">LOW</span><br><span class="percentage">{{ version.low }}</span>
          </div>
          <div class="vulnerability-box">
            <span class="unassigned">UNASSIGNED</span><br><span class="percentage">{{ version.unassigned }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Line, Chart } from 'chart.js';

export default {
  name: 'History2',
  props: ['projectId'],
  data() {
    return {
      project: {},
      mostRecentVersion: {},
      previousVersions: []
    };
  },
  created() {
    this.fetchProjectData();
  },
  methods: {
    async fetchProjectData() {
      try {
        const response = await fetch(`http://43.201.110.185:8080/api/project/${this.projectId}/history`);
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        const data = await response.json();
        this.project = {
          name: data.name,
          lastAnalyzed: data.date,
          previousVersions: data.ver_lists.map(version => ({
            version: version.version,
            critical: version.vuln.vuln_lists.filter(vuln => vuln.severity === 'Critical').length,
            high: version.vuln.vuln_lists.filter(vuln => vuln.severity === 'High').length,
            medium: version.vuln.vuln_lists.filter(vuln => vuln.severity === 'Medium').length,
            low: version.vuln.vuln_lists.filter(vuln => vuln.severity === 'Low').length,
            unassigned: version.vuln.vuln_lists.filter(vuln => vuln.severity === 'Unassigned').length,
          }))
        };
        this.previousVersions = this.project.previousVersions;
        this.mostRecentVersion = this.previousVersions[0];
        this.renderChart();
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    },
    renderChart() {
      const ctx = document.getElementById('vulnerabilityChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.previousVersions.map(version => `ver.${version.version}`),
          datasets: [
            {
              label: 'Critical',
              data: this.previousVersions.map(version => version.critical),
              borderColor: '#ff4d4d',
              fill: false
            },
            {
              label: 'High',
              data: this.previousVersions.map(version => version.high),
              borderColor: '#ffa500',
              fill: false
            },
            {
              label: 'Medium',
              data: this.previousVersions.map(version => version.medium),
              borderColor: '#ffd700',
              fill: false
            },
            {
              label: 'Low',
              data: this.previousVersions.map(version => version.low),
              borderColor: '#9370db',
              fill: false
            },
            {
              label: 'Unassigned',
              data: this.previousVersions.map(version => version.unassigned),
              borderColor: '#32cd32',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true,
              suggestedMin: 0
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
body {
  color: #2c3e50;
  font-family: Arial, sans-serif;
}

.history-detail {
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

.project-summary {
  margin-top: 20px;
}

.dashboard-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border: 2px solid #2c3e50;
  border-radius: 10px; 
  padding: 20px;
  position: relative;
}

canvas {
  margin-bottom: 20px;
  height: 400px !important;
}

.info-title {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 10px;
}

.vulnerability-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.vulnerability-box {
  padding: 10px;
  border-radius: 30px;
  text-align: center;
  flex-grow: 1;
  margin: 5px;
  background-color: #2c3e50;
  color: white;
  width: calc(100% / 5 - 20px);
}

.critical, .high, .medium, .low, .unassigned {
  font-size: 1.0em;
}

.percentage {
  font-size: 0.8em;
}

.critical {
  color: #ff4d4d;
}

.high {
  color: #ffa500;
}

.medium {
  color: #ffd700;
}

.low {
  color: #9370db;
}

.unassigned {
  color: #32cd32;
}

.previous-version {
  margin-top: 20px;
  background-color: #ffffff;
  border: 2px solid #2c3e50;
  border-radius: 10px;
  padding: 10px;
}

.version-header {
  font-size: 1.2em;
  font-weight: bold;
  text-align: left;
  margin-bottom: 10px;
}
</style>
