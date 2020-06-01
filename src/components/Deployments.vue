<template>
    <div style="padding-top: 1px;">
        <div class="info">
            <div style="text-align: left;margin-top: 20px;margin-left: 20px;margin-bottom: 20px;">
                <el-form label-width="90px" label-position="left">
                    <el-form-item label="命名空间: ">
                        <el-select v-model="value" placeholder="全部命名空间" @change="getNamespacedDeployments()">
                            <el-option
                                    v-for="item in options"
                                    :key="item.metadata.name"
                                    :label="item.metadata.name"
                                    :value="item.metadata.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-button @click="add" type="primary" size="mini">添加</el-button>
            </div>
            <div>
                <el-dialog title="添加Deployment" :visible.sync="addDeployment">
                    <div style="width: 70%;margin: 0 auto;">
                        <el-form :model="deployment">
                            <el-form-item label="Deployment 名: " :label-width="formLabelWidth">
                                <el-input placeholder="Deployments 名" v-model="deployment.metadata.name"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="命名空间: " :label-width="formLabelWidth">
                                <el-select placeholder="默认为 default" v-model="deployment.metadata.namespace"
                                           @change="getNamespacedDeployments()">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.metadata.name"
                                            :label="item.metadata.name"
                                            :value="item.metadata.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="副本个数: " :label-width="formLabelWidth">
                                <el-input placeholder="默认为1个" v-model="deployment.spec.replicas"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Label(仅输入值): " :label-width="formLabelWidth">
                                <el-input placeholder="默认为 Deployment 名"
                                          v-model="deployment.spec.selector.matchLabels.label"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="镜像名: " :label-width="formLabelWidth">
                                <el-input placeholder="镜像名" v-model="deployment.spec.template.spec.containers[0].image"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="容器名: " :label-width="formLabelWidth">
                                <el-input placeholder="容器名" v-model="deployment.spec.template.spec.containers[0].name"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="容器端口号: " :label-width="formLabelWidth">
                                <el-input placeholder="容器端口号"
                                          v-model="deployment.spec.template.spec.containers[0].ports[0].containerPort"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Cpu资源(单位m，1000m=1c): " :label-width="formLabelWidth">
                                <el-input placeholder="请带单位，如250m"
                                          v-model="deployment.spec.template.spec.containers[0].resources.limits.cpu"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="Memory资源(单位Mi): " :label-width="formLabelWidth">
                                <el-input placeholder="请带单位，如100Mi"
                                          v-model="deployment.spec.template.spec.containers[0].resources.limits.memory"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addDeployment = false">取 消</el-button>
                        <el-button :plain="true" type="primary" @click="addDeploymentFun">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <div>
                <el-dialog title="修改副本数" :visible.sync="patchReplica">
                    <div style="width: 70%;margin: 0 auto;">
                        <el-form :model="patch">
                            <el-form-item label="更新的副本数: " :label-width="formLabelWidth">
                                <el-input placeholder="Deployments 名"
                                          v-model="patch.value"
                                          autocomplete="off"
                                          type="number"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="patchReplica = false">取 消</el-button>
                        <el-button :plain="true" type="primary" @click="patchReplicaFun2">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <div style="margin-left: 20px;">
                <el-table
                        :data="deployments"
                        style="width: 100%"
                        max-height="500">
                    <el-table-column
                            prop="metadata.name"
                            label="名称"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="spec.template.spec.containers[0].image"
                            label="镜像名"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="spec.replicas"
                            label="副本数"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="status.availableReplicas"
                            label="可用的副本数"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="metadata.namespace"
                            label="命名空间"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="spec.selector.matchLabels.label"
                            label="Label"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="150">
                        <template slot-scope="scope">
                            <el-button @click="patchReplicaFun(scope.row)" type="text" size="small">扩容</el-button>
                            <el-button @click="deleteDeploymentFun(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog title="提示"
                       :visible.sync="deleteDeployment"
                       width="30%">
                <span>确定删除命名空间 {{this.row.metadata.name}} ?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteDeployment = false">取 消</el-button>
                    <el-button type="primary" @click="deleteDeploymentFun2">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
	import {
		deploymentsForAllNamespaces,
		namespaces,
		namespacedDeployments,
		cluster,
		addDeployment,
		deleteDeployment,
		patchReplica
	} from "../axios/apis";

	export default {
		name: "Deployments",
		data() {
			return {
				deployments: [],
				options: [],
				value: '',
				addDeployment: false,
				patchReplica: false,
				deleteDeployment: false,
				row: {
					metadata: {
						name: "",
						namespace: ""
					}
				},
				formLabelWidth: '150px',
				deployment: {
					apiVersion: "apps/v1",
					kind: "Deployment",
					metadata: {
						name: "",
						namespace: "default"
					},
					spec: {
						replicas: 1,
						selector: {
							matchLabels: {
								label: ""
							}
						},
						template: {
							metadata: {
								labels: {
									label: ""
								}
							},
							spec: {
								containers: [
									{
										image: "",
										name: "",
										ports: [
											{
												containerPort: ""
											}
										],
										resources: {
											limits: {
												cpu: "250m",
												memory: "100Mi"
											},
											requests: {
												cpu: "250m",
												memory: "100Mi"
											}
										}
									}
								]
							}
						}
					}
				},
				patch: {
					op: "replace",
					path: "/spec/replicas",
					value: 1
				}
			}
		},
		created() {
			cluster(null).then(res => {
				console.log(res)
				if (res.message == null) {
					this.$router.replace("/404")
				}
			})
		},
		mounted() {
			deploymentsForAllNamespaces(null).then(res => {
				for (let i = 0; i < res.items.length; i++) {
					let d = new Date(res.items[i].metadata.creationTimestamp)
					res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
						+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
						+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
				}
				this.deployments = res.items
			});
			namespaces(null).then(res => {
				res.items[res.items.length] = {
					metadata: {
						name: "全部命名空间"
					}
				}
				this.options = res.items
				console.log(res)
			})
		},
		methods: {
			getNamespacedDeployments() {
				if (this.value === "全部命名空间") {
					deploymentsForAllNamespaces(null).then(res => {
						for (let i = 0; i < res.items.length; i++) {
							let d = new Date(res.items[i].metadata.creationTimestamp)
							res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
								+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
								+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
						}
						this.deployments = res.items
					});
				} else {
					namespacedDeployments(this.value, null).then(res => {
						for (let i = 0; i < res.items.length; i++) {
							let d = new Date(res.items[i].metadata.creationTimestamp)
							res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
								+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
								+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
						}
						this.deployments = res.items
					})
				}
			},
			add() {
				this.addDeployment = true
			},
			addDeploymentFun() {
				this.deployment.spec.template.metadata.labels.label =
                    this.deployment.spec.selector.matchLabels.label
				this.deployment.spec.template.spec.containers[0].resources.requests.memory =
                    this.deployment.spec.template.spec.containers[0].resources.limits.memory
				this.deployment.spec.template.spec.containers[0].resources.requests.cpu =
                    this.deployment.spec.template.spec.containers[0].resources.limits.cpu
				this.deployment.spec.template.spec.containers[0].ports[0].containerPort =
                    parseInt(this.deployment.spec.template.spec.containers[0].ports[0].containerPort)
				addDeployment(this.deployment.metadata.namespace, this.deployment).then(res => {
					console.log(res)
					this.$router.go(0)
				})
			},
			deleteDeploymentFun(row) {
				this.row = row
				this.deleteDeployment = true
			},
			deleteDeploymentFun2() {
				deleteDeployment(this.row.metadata.namespace, this.row.metadata.name, null).then(res => {
					console.log(res)
					this.row = {}
					this.$router.go(0)
				})
				this.deleteDeployment = false
			},
			patchReplicaFun(row) {
				this.row = row
				this.patchReplica = true
			},
			patchReplicaFun2() {
				this.patch.value = parseInt(this.patch.value)
				patchReplica(this.row.metadata.namespace, this.row.metadata.name, this.patch).then(res => {
					console.log(res)
					this.row = {}
					this.$router.go(0)
				})
				this.patchReplica = false
			}
		}
	}
</script>

<style scoped>
    .info {
        width: 90%;
        margin: 20px auto 0;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        padding-top: 1px;
        padding-bottom: 1px;
    }
</style>