import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import ServerDashboard from './components/ServerDashboard.vue';
import CodeDashboard from './components/CodeDashboard.vue';
import History from './components/History.vue';
import History2 from './components/History2.vue';
import Project from '../components/Project.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Project },
  { path: '/server', component: Server },
  { path: '/codedashboard/:repoName', name: 'CodeDashboard', component: CodeDashboard, props: true },
  { path: '/serverdashboard/:repoName', name: 'ServerDashboard', component: ServerDashboard, props: true },
  { path: '/history', component: History },
  { path: '/history/:projectId', component: History2, props: true }
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
