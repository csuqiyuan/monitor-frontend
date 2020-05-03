import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from "../components/HelloWorld";
import Home from "../components/Home";
import Nodes from '../components/Nodes';
import Node from '../components/Node';

Vue.use(Router)

export default new Router({
		routes: [
			{
				path: '/hello',
				component: HelloWorld
			},
			{
				path: '/',
				component: Home
			},
			{
				path: '/nodes',
				component: Nodes
			},
			{
				path:'/node',
				component:Node
			}
		]
	}
)