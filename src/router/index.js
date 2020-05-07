import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Nodes from '../components/Nodes';
import Node from '../components/Node';
import Namespaces from "../components/Namespaces";
import Deployments from "../components/Deployments";
import Pods from "../components/Pods";
import Services from "../components/Services";
import NoCluster from "../components/NoCluster";
import Pod from "../components/Pod";

Vue.use(Router)

export default new Router({
		routes: [
			{
				path: '/',
				component: Home
			},
			{
				path: '/nodes',
				component: Nodes
			},
			{
				path: '/node',
				component: Node
			},
			{
				path: '/namespaces',
				component: Namespaces,
			},
			{
				path: '/deployments',
				component: Deployments
			},
			{
				path: '/pods',
				component: Pods
			},
			{
				path:'/pod',
				component: Pod
			},
			{
				path: '/services',
				component: Services
			},
			{
				path: '/404',
				component: NoCluster
			}
		]
	}
)