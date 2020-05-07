<template>
    <div style="padding-top: 1px;">
        <div class="info">
            <div style="text-align: left;margin-top: 20px;margin-left: 20px;">
                <el-form label-width="90px" label-position="left">
                    <el-form-item label="命名空间: ">
                        <el-select v-model="value" placeholder="全部命名空间" @change="getNamespacedServices()">
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
            <div style="margin-left: 20px;">
                <el-table
                        :data="services"
                        style="width: 100%">
                    <el-table-column
                            prop="metadata.name"
                            label="名称"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="spec.clusterIP"
                            label="ClusterIP"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="spec.type"
                            label="类型"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="ports"
                            label="集群内端口"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="nodePorts"
                            label="集群外端口"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="metadata.namespace"
                            label="命名空间"
                            width="100">
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
                            <el-button @click="deleteServiceFun(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <el-dialog title="添加 Service" :visible.sync="addService">
                    <div style="width: 70%;margin: 0 auto;">
                        <el-form :model="service">
                            <el-form-item label="Service 名: " :label-width="formLabelWidth">
                                <el-input placeholder="Deployments 名" v-model="service.metadata.name"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="命名空间: " :label-width="formLabelWidth">
                                <el-select v-model="service.metadata.namespace" placeholder="全部命名空间"
                                           @change="getNamespacedServices()">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.metadata.name"
                                            :label="item.metadata.name"
                                            :value="item.metadata.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Label(仅输入值): " :label-width="formLabelWidth">
                                <el-input v-model="service.spec.selector.label"
                                          autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="类型: " :label-width="formLabelWidth">
                                <el-select v-model="service.spec.type" placeholder="请选择">
                                    <el-option
                                            v-for="item in type"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="内部端口: " :label-width="formLabelWidth">
                                <el-input placeholder="用于集群内部的端口"
                                          v-model="service.spec.ports[0].port"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="外部端口(类型为NodePort时需填写): " :label-width="formLabelWidth">
                                <el-input placeholder="用于集群外部的端口(范围30000-50000)"
                                          v-model="service.spec.ports[0].nodePort"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addService = false">取 消</el-button>
                        <el-button :plain="true" type="primary" @click="addServiceFun">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <el-dialog title="提示"
                       :visible.sync="deleteService"
                       width="30%">
                <span>确定删除 Service {{this.row.metadata.name}} ?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteService = false">取 消</el-button>
                    <el-button type="primary" @click="deleteServiceFun2">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
	import {
		cluster,
		namespacedServices,
		namespaces,
		services,
		addService,
		deleteService
	} from "../axios/apis";

	export default {
		name: "Service",
		data() {
			return {
				services: [],
				options: [],
				value: '',
				addService: false,
				formLabelWidth: '150px',
				deleteService: false,
				row: {
					metadata: {
						name: "",
						namespace: ""
					},
				},
				service: {
					apiVersion: "v1",
					kind: "Service",
					metadata: {
						name: "",
						namespace: "default"
					},
					spec: {
						type: "ClusterIP",
						ports: [
							{
								port: "",
								nodePort: ""
							}
						],
						selector: {
							label: ""
						},
					}
				},
				type: [
					{
						value: "ClusterIP"
					},
					{
						value: "NodePort"
					}
				],
			}
		},
		mounted() {
			services(null).then(res => {
				for (let i = 0; i < res.items.length; i++) {
					let d = new Date(res.items[i].metadata.creationTimestamp)
					res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
						+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
						+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
					res.items[i].ports = ""
					res.items[i].nodePorts = ""
					for (let j = 0; j < res.items[i].spec.ports.length; j++) {
						res.items[i].ports += (res.items[i].spec.ports[j].port + " ")
						if (res.items[i].spec.type === "NodePort" && res.items[i].spec.ports[j].nodePort !== null) {
							res.items[i].nodePorts = (res.items[i].spec.ports[j].nodePort + " ")
						}
					}

				}
				this.services = res.items
			});
			namespaces(null).then(res => {
				res.items[res.items.length] = {
					metadata: {
						name: "全部命名空间"
					}
				}
				this.options = res.items
			})
		},
		created() {
			cluster(null).then(res => {
				console.log(res)
				if (res.message == null) {
					this.$router.replace("/404")
				}
			})
		},
		methods: {
			getNamespacedServices() {
				if (this.value === "全部命名空间") {
					services(null).then(res => {
						for (let i = 0; i < res.items.length; i++) {
							let d = new Date(res.items[i].metadata.creationTimestamp)
							res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
								+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
								+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
							res.items[i].ports = ""
							res.items[i].nodePorts = ""
							for (let j = 0; j < res.items[i].spec.ports.length; j++) {
								res.items[i].ports += (res.items[i].spec.ports[j].port + " ")
								if (res.items[i].spec.type === "NodePort" && res.items[i].spec.ports[j].nodePort !== null) {
									res.items[i].nodePorts = (res.items[i].spec.ports[j].nodePort + " ")
								}
							}

						}
						this.services = res.items
					});
				} else {
					namespacedServices(this.value, null).then(res => {
						for (let i = 0; i < res.items.length; i++) {
							let d = new Date(res.items[i].metadata.creationTimestamp)
							res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
								+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
								+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
							res.items[i].ports = ""
							res.items[i].nodePorts = ""
							for (let j = 0; j < res.items[i].spec.ports.length; j++) {
								res.items[i].ports += (res.items[i].spec.ports[j].port + " ")
								if (res.items[i].spec.type === "NodePort" && res.items[i].spec.ports[j].nodePort !== null) {
									res.items[i].nodePorts = (res.items[i].spec.ports[j].nodePort + " ")
								}
							}

						}
						this.services = res.items
					});
				}
			},
			deleteServiceFun(row) {
				this.row = row
				this.deleteService = true
			},
			deleteServiceFun2() {
				deleteService(this.row.metadata.namespace, this.row.metadata.name, null).then(res => {
					console.log(res)
					this.row = {}
					this.$router.go(0)
				})
				this.deleteService = false
			},
			add() {
				this.addService = true
			},
			addServiceFun() {
				this.service.spec.ports[0].port = parseInt(this.service.spec.ports[0].port)
				this.service.spec.ports[0].nodePort = parseInt(this.service.spec.ports[0].nodePort)
				addService(this.service.metadata.namespace, null).then(res => {
					console.log(res)
					this.$router.go(0)
				})
				this.addService = false
			},
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