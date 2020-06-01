<template>
    <div style="padding-top: 1px;">
        <div class="info">
            <div style="text-align: left;margin-top: 20px;margin-left: 20px;">
                <el-form label-width="90px" label-position="left">
                    <el-form-item label="命名空间: ">
                        <el-select v-model="value" placeholder="全部命名空间" @change="getNamespacedPods()">
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
                        max-height="500"
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="metadata.name"
                            label="名称"
                            width="120"
                            fixed="left">
                    </el-table-column>
                    <el-table-column
                            prop="images"
                            label="镜像"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="status.phase"
                            label="状态"
                            width="100">
                        <template slot-scope="scope">
                        <span v-if="scope.row.status.phase==='Running'"
                              style="color:#67C23A;font-weight: bold;">{{scope.row.status.phase}}</span>
                            <span v-else style="color: #F56C6C;font-weight: bold;">{{scope.row.status.phase}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="metadata.namespace"
                            label="命名空间"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="requestCpu"
                            label="申请CPU"
                            width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.requestCpu===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{scope.row.requestCpu}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="requestMemory"
                            label="申请Memory"
                            width="110">
                        <template slot-scope="scope">
                            <span v-if="scope.row.requestMemory===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{scope.row.requestMemory}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="limitCpu"
                            label="最大CPU"
                            width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.limitCpu===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{scope.row.limitCpu}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="limitMemory"
                            label="最大Memory"
                            width="110">
                        <template slot-scope="scope">
                            <span v-if="scope.row.limitMemory===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{scope.row.limitMemory}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="metadata.labels.label"
                            label="Label"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="100">
                        <template slot-scope="scope">
                            <el-button @click="checkPod(scope.row)" type="text" size="small">查看</el-button>
                            <el-button @click="deletePodFun(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div>
            <el-dialog title="添加Deployment" :visible.sync="addPod">
                <div style="width: 70%;margin: 0 auto;">
                    <el-form :model="pod">
                        <el-form-item label="Pod 名: " :label-width="formLabelWidth">
                            <el-input placeholder="Pod 名" v-model="pod.metadata.name"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="命名空间: " :label-width="formLabelWidth">
                            <el-select placeholder="默认为 default" v-model="pod.metadata.namespace"
                                       @change="getNamespacedPods">
                                <el-option
                                        v-for="item in options"
                                        :key="item.metadata.name"
                                        :label="item.metadata.name"
                                        :value="item.metadata.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Label(仅输入值): " :label-width="formLabelWidth">
                            <el-input placeholder="默认为 Pod 名"
                                      v-model="pod.metadata.labels.label"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="容器名: " :label-width="formLabelWidth">
                            <el-input placeholder="容器名" v-model="pod.spec.containers[0].name"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="镜像名: " :label-width="formLabelWidth">
                            <el-input placeholder="镜像名" v-model="pod.spec.containers[0].image"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="容器端口号: " :label-width="formLabelWidth">
                            <el-input placeholder="容器端口号"
                                      v-model="pod.spec.containers[0].ports[0].containerPort"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Cpu资源(单位m，1000m=1c): " :label-width="formLabelWidth">
                            <el-input placeholder="请带单位，如250m"
                                      v-model="pod.spec.containers[0].resources.limits.cpu"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Memory资源(单位Mi): " :label-width="formLabelWidth">
                            <el-input placeholder="请带单位，如100Mi"
                                      v-model="pod.spec.containers[0].resources.limits.memory"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="add = false">取 消</el-button>
                    <el-button :plain="true" type="primary" @click="addPodFun">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <el-dialog title="提示"
                   :visible.sync="deletePod"
                   width="30%">
            <span>确定删除 Pod {{this.row.metadata.name}} ?</span>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="deletePod = false">取 消</el-button>
                    <el-button type="primary" @click="deletePodFun2">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
	import {allPods, cluster, namespacedPods, namespaces, addPod, deletePod} from "../axios/apis";

	export default {
		name: "Pods",
		data() {
			return {
				tableData: [],
				options: [],
				value: '',
				addPod: false,
				formLabelWidth: '150px',
				deletePod: false,
				row: {
					metadata: {
						name: "",
						namespace: ""
					},
				},
				pod: {
					apiVersion: "v1",
					kind: "Pod",
					metadata: {
						name: "",
						namespace: "default",
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
		created() {
			cluster(null).then(res => {
				console.log(res)
				if (res.message == null) {
					this.$router.replace("/404")
				}
			})
		},
		methods: {
			getNamespacedPods() {
				if (this.value === "全部命名空间") {
					allPods(null).then(res => {
						for (let i = 0; i < res.items.length; i++) {
							res.items[i].requestCpu = 0;
							res.items[i].requestMemory = 0;
							res.items[i].limitCpu = 0;
							res.items[i].limitMemory = 0;
							res.items[i].images = "";
							let d = new Date(res.items[i].metadata.creationTimestamp)
							res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
								+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
								+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
							for (let j = 0; j < res.items[i].spec.containers.length; j++) {
								try {
									res.items[i].images += (res.items[i].spec.containers[j].image + '\n')
								} catch (e) {
									res.items[i].images += ""
								}
								try {
									res.items[i].requestCpu += res.items[i].spec.containers[j].resources.requests.cpu.number
								} catch (e) {
									res.items[i].requestCpu += 0
								}
								try {
									res.items[i].requestMemory += Math.round(res.items[i].spec.containers[j].resources.requests.memory.number / 1024 / 1024)
								} catch (e) {
									res.items[i].requestMemory += 0
								}
								try {
									res.items[i].limitCpu += res.items[i].spec.containers[j].resources.limits.cpu.number
								} catch (e) {
									res.items[i].limitCpu += 0
								}
								try {
									res.items[i].limitMemory += Math.round(res.items[i].spec.containers[j].resources.limits.memory.number / 1024 / 1024)
								} catch (e) {
									res.items[i].limitMemory += 0
								}
							}
						}
						this.tableData = res.items
					})
				} else {
					namespacedPods(this.value, null).then(res => {
						for (let i = 0; i < res.items.length; i++) {
							res.items[i].requestCpu = 0;
							res.items[i].requestMemory = 0;
							res.items[i].limitCpu = 0;
							res.items[i].limitMemory = 0;
							res.items[i].images = "";
							let d = new Date(res.items[i].metadata.creationTimestamp)
							res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
								+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
								+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
							for (let j = 0; j < res.items[i].spec.containers.length; j++) {
								try {
									res.items[i].images += (res.items[i].spec.containers[j].image + '\n')
								} catch (e) {
									res.items[i].images += ""
								}
								try {
									res.items[i].requestCpu += res.items[i].spec.containers[j].resources.requests.cpu.number
								} catch (e) {
									res.items[i].requestCpu += 0
								}
								try {
									res.items[i].requestMemory += Math.round(res.items[i].spec.containers[j].resources.requests.memory.number / 1024 / 1024)
								} catch (e) {
									res.items[i].requestMemory += 0
								}
								try {
									res.items[i].limitCpu += res.items[i].spec.containers[j].resources.limits.cpu.number
								} catch (e) {
									res.items[i].limitCpu += 0
								}
								try {
									res.items[i].limitMemory += Math.round(res.items[i].spec.containers[j].resources.limits.memory.number / 1024 / 1024)
								} catch (e) {
									res.items[i].limitMemory += 0
								}
							}
						}
						this.tableData = res.items
					})
				}
			},
			checkPod(row) {
				this.$router.push({path: 'pod', query: {namespace: row.metadata.namespace, name: row.metadata.name}})
			},
			add() {
				this.addPod = true
			},
			addPodFun() {
				this.pod.spec.containers[0].resources.requests.memory = this.pod.spec.containers[0].resources.limits.memory
				this.pod.spec.containers[0].resources.requests.cpu = this.pod.spec.containers[0].resources.limits.cpu
				this.pod.spec.containers[0].ports[0].containerPort =
					parseInt(this.pod.spec.containers[0].ports[0].containerPort)
				addPod(this.pod.metadata.namespace, this.pod).then(res => {
					console.log(res)
					this.$router.go(0)
				})
			},
			deletePodFun(row) {
				this.deletePod = true;
				this.row = row;
			},
			deletePodFun2() {
				console.log(this.row)
				deletePod(this.row.metadata.namespace,this.row.metadata.name).then(res=>{
					console.log(res)
					this.row = {}
					this.$router.go(0)
                })
                this.deletePod = false
			},

		},
		mounted() {
			namespaces(null).then(res => {
				res.items[res.items.length] = {
					metadata: {
						name: "全部命名空间"
					}
				}
				this.options = res.items
				console.log(res)
			})
			allPods(null).then(res => {
				for (let i = 0; i < res.items.length; i++) {
					res.items[i].requestCpu = 0;
					res.items[i].requestMemory = 0;
					res.items[i].limitCpu = 0;
					res.items[i].limitMemory = 0;
					res.items[i].images = "";
					let d = new Date(res.items[i].metadata.creationTimestamp)
					res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
						+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
						+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
					for (let j = 0; j < res.items[i].spec.containers.length; j++) {
						try {
							res.items[i].images += (res.items[i].spec.containers[j].image + '\n')
						} catch (e) {
							res.items[i].images += ""
						}
						try {
							res.items[i].requestCpu += res.items[i].spec.containers[j].resources.requests.cpu.number
						} catch (e) {
							res.items[i].requestCpu += 0
						}
						try {
							res.items[i].requestMemory += Math.round(res.items[i].spec.containers[j].resources.requests.memory.number / 1024 / 1024)
						} catch (e) {
							res.items[i].requestMemory += 0
						}
						try {
							res.items[i].limitCpu += res.items[i].spec.containers[j].resources.limits.cpu.number
						} catch (e) {
							res.items[i].limitCpu += 0
						}
						try {
							res.items[i].limitMemory += Math.round(res.items[i].spec.containers[j].resources.limits.memory.number / 1024 / 1024)
						} catch (e) {
							res.items[i].limitMemory += 0
						}
					}
				}
				this.tableData = res.items
			})
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