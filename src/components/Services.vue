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
                            <el-button @click="handleClick(scope.row)" type="text" size="small">扩容</el-button>
                            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
	import {
		cluster,
		namespacedServices,
		namespaces,
		services
	} from "../axios/apis";

	export default {
		name: "Service",
		data() {
			return {
				services: [],
				options: [],
				value: ''
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
				if (res.message==null){
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