<template>
    <div style="padding-top: 1px;">
        <div class="info">
            <p class="title">基本信息：</p>
            <div class="info-left">
                <el-form label-width="200px" label-position="left">
                    <el-form-item label="名称: ">
                        {{pod.metadata.name}}
                    </el-form-item>
                    <el-form-item label="命名空间: ">
                        {{pod.metadata.namespace}}
                    </el-form-item>
                    <el-form-item label="镜像: ">
                        {{pod.images}}
                    </el-form-item>
                    <el-form-item label="状态: ">
                        <template>
                        <span v-if="pod.status.phase==='Running'"
                              style="color:#67C23A;font-weight: bold;">{{pod.status.phase}}</span>
                            <span v-else style="color: #F56C6C;font-weight: bold;">{{pod.status.phase}}</span>
                        </template>
                    </el-form-item>
                    <el-form-item label="创建时间: ">
                        {{pod.createTime}}
                    </el-form-item>
                    <el-form-item label="申请的Cpu数(c): ">
                        <template>
                            <span v-if="pod.requestCpu===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{pod.requestCpu}}</span>
                        </template>
                    </el-form-item>
                    <el-form-item label="申请的Memory数(Mb)">
                        <template>
                            <span v-if="pod.requestMemory===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{pod.requestMemory}}</span>
                        </template>
                    </el-form-item>
                    <el-form-item label="最大的Cpu数(c)">
                        <template>
                            <span v-if="pod.limitCpu===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{pod.limitCpu}}</span>
                        </template>
                    </el-form-item>
                    <el-form-item label="最大的Memory数(Mb)">
                        <template>
                            <span v-if="pod.limitMemory===0" style="color: #F56C6C">unknown</span>
                            <span v-else>{{pod.limitMemory}}</span>
                        </template>
                    </el-form-item>
                    <el-form-item label="所在节点名: ">
                        {{pod.spec.nodeName}}
                    </el-form-item>
                </el-form>

            </div>
        </div>
        <div class="info">
            <p class="title">Pod 上运行的容器：</p>
            <el-table
                    max-height="500"
                    :data="pod.spec.containers"
                    style="width: 95%;margin: 0 auto;">
                <el-table-column
                        prop="name"
                        label="容器名"
                        width="120"
                        fixed="left">
                </el-table-column>
                <el-table-column
                        prop="image"
                        label="镜像名"
                        width="120"
                        fixed="left">
                </el-table-column>
                <el-table-column
                        prop="resources.requests.cpu.number"
                        label="请求Cpu(c)"
                        width="120"
                        fixed="left">
                </el-table-column>
                <el-table-column
                        prop="resources.requests.memory.number"
                        label="请求Memory(c)"
                        width="120"
                        fixed="left">
                </el-table-column>
                <el-table-column
                        prop="resources.limits.cpu.number"
                        label="最大Cpu(c)"
                        width="120"
                        fixed="left">
                </el-table-column>
                <el-table-column
                        prop="resources.limits.memory.number"
                        label="最大Memory(c)"
                        width="120"
                        fixed="left">
                </el-table-column>
            </el-table>
        </div>
    </div>

</template>

<script>
	import {podByName} from "../axios/apis";

	export default {
		name: "Pod",
		data() {
			return {
				pod: {}
			}
		},
		created() {
			podByName(this.$route.query.namespace, this.$route.query.name, null).then(res => {
				res.requestCpu = 0;
				res.requestMemory = 0;
				res.limitCpu = 0;
				res.limitMemory = 0;
				res.images = "";
				let d = new Date(res.metadata.creationTimestamp)
				res.createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
					+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
					+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
				for (let j = 0; j < res.spec.containers.length; j++) {
					try {
						res.images += (res.spec.containers[j].image + '\n')
					} catch (e) {
						res.images += ""
					}
					try {
						res.requestCpu += res.spec.containers[j].resources.requests.cpu.number
					} catch (e) {
						res.requestCpu += 0
					}
					try {
						res.requestMemory += Math.round(res.spec.containers[j].resources.requests.memory.number / 1024 / 1024)
					} catch (e) {
						res.requestMemory += 0
					}
					try {
						res.limitCpu += res.spec.containers[j].resources.limits.cpu.number
					} catch (e) {
						res.limitCpu += 0
					}
					try {
						res.limitMemory += Math.round(res.spec.containers[j].resources.limits.memory.number / 1024 / 1024)
					} catch (e) {
						res.limitMemory += 0
					}
				}
				this.pod = res
				console.log(this.pod)
			})
		},
		methods: {
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

    .info-left {
        width: 50%;
        margin-top: 20px;
        margin-left: 40px;
        margin-bottom: 20px;
    }


    .title {
        font-size: 18px;
        font-weight: bold;
        line-height: 30px;
        text-align: left;
        margin: 10px 20px 0;
    }
</style>