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
            </div>
            <div style="margin-left: 20px;">
                <el-table
                        max-height="500"
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="metadata.name"
                            label="名称"
                            width="100"
                            fixed="left">
                    </el-table-column>
                    <el-table-column
                            prop="spec.containers[0].image"
                            label="镜像"
                            width="100">
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
                            label="申请CPU资源"
                            width="120">
                        <template slot-scope="scope">
                            <span v-if="scope.row.requestCpu===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{scope.row.requestCpu}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="requestMemory"
                            label="申请Memory资源"
                            width="140">
                        <template slot-scope="scope">
                            <span v-if="scope.row.requestMemory===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{scope.row.requestMemory}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="limitCpu"
                            label="最大CPU资源"
                            width="120">
                        <template slot-scope="scope">
                            <span v-if="scope.row.limitCpu===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{scope.row.limitCpu}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="limitMemory"
                            label="最大Memory资源"
                            width="140">
                        <template slot-scope="scope">
                            <span v-if="scope.row.limitMemory===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{scope.row.limitMemory}}</span>
                        </template>
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
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                            <el-button type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
	import {allPods, cluster, namespacedPods, namespaces} from "../axios/apis";

	export default {
		name: "Pods",
		data() {
			return {
				tableData: [],
				options: [],
				value: ''
			}
		},
		created() {
			cluster(null).then(res => {
				console.log(res)
				if (res.message==null){
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
							let d = new Date(res.items[i].metadata.creationTimestamp)
							res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
								+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
								+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
							for (let j = 0; j < res.items[i].spec.containers.length; j++) {
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
							let d = new Date(res.items[i].metadata.creationTimestamp)
							res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
								+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
								+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
							for (let j = 0; j < res.items[i].spec.containers.length; j++) {
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
					let d = new Date(res.items[i].metadata.creationTimestamp)
					res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
						+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
						+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
					for (let j = 0; j < res.items[i].spec.containers.length; j++) {
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