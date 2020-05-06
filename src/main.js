import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/common.css'
import echarts from 'echarts';
import axios from './axios';

Vue.prototype.$axios = axios
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
