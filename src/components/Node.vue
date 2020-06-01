<template>
    <div style="padding-top: 1px">
        <span style="font-size: 22px;font-weight: bold;">{{this.$route.query.hostname}}</span>
        <div class="info">
            <p class="title">基本信息：</p>
            <div class="info-left">
                <el-form label-width="130px" label-position="left">
                    <el-form-item label="节点名称: ">
                        {{nodeInfo.hostname}}
                    </el-form-item>
                    <el-form-item label="节点地址: ">
                        {{nodeInfo.address}}
                    </el-form-item>
                    <el-form-item label="节点系统: ">
                        {{nodeInfo.osImage}}
                    </el-form-item>
                    <el-form-item label="创建时间: ">
                        {{nodeInfo.createTime}}
                    </el-form-item>
                    <el-form-item label="Cpu总量(c): ">
                        {{nodeInfo.totalCpu}}
                    </el-form-item>
                    <el-form-item label="内存总量(M): ">
                        {{nodeInfo.totalMemory}}
                    </el-form-item>
                    <el-form-item label="可用Cpu总量: ">
                        {{nodeInfo.restCpu}}
                    </el-form-item>
                    <el-form-item label="可用内存总量: ">
                        {{nodeInfo.restMemory}}
                    </el-form-item>
                    <el-form-item label="剩余可用Cpu总量: ">
                        {{nodeInfo.usableCpu}}
                    </el-form-item>
                    <el-form-item label="剩余可用内存总量: ">
                        {{nodeInfo.usableMemory}}
                    </el-form-item>
                </el-form>

            </div>
            <div class="info-box">
                <div id="main" class="box"></div>
            </div>
        </div>
        <div class="info">
            <p class="title">节点上运行的 Pod：</p>
            <el-table
                    max-height="500"
                    :data="tableData"
                    style="width: 95%;margin: 0 auto">
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
    </div>
</template>

<script>
	import {cluster, deletePod, node, podsByNode} from "../axios/apis";

	export default {
		name: "Node",
		data() {
			return {
				nodeInfo: {},
				tableData: [],
				isActive: true,
				deletePod: false,
				row: {
					metadata: {
						name: "",
						namespace: ""
					},
				},
			}
		},
		mounted() {
			node(this.$route.query.hostname, null).then(res => {
				res.totalMemory = Math.round(res.totalMemory / 1024 / 1024)
				res.restMemory = Math.round(res.restMemory / 1024 / 1024)
				res.usableMemory = Math.round(res.usableMemory / 1024 / 1024)
				this.nodeInfo = res
				this.drawChart()
			});
			podsByNode(this.$route.query.hostname, null).then(res => {
				for (let i = 0; i < res.items.length; i++) {
					res.items[i].requestCpu = 0;
					res.items[i].requestMemory = 0;
					res.items[i].limitCpu = 0;
					res.items[i].limitMemory = 0;
					res.items[i].images = ""
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
			checkPod(row) {
				this.$router.push({path: 'pod', query: {namespace: row.metadata.namespace, name: row.metadata.name}})
			},
			drawChart() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById("main"));
				// 指定图表的配置项和数据
				let option = {
					title: [
						{
							text: '节点资源总揽',
							left: '50%',
							top: 0,
							textAlign: 'center'
						},
						{
							subtext: 'CPU使用情况',
							left: '32%',
							top: '80%',
							textAlign: 'center'
						},
						{
							subtext: 'Memory使用情况',
							right: '18%',
							top: '80%',
							textAlign: 'center'
						}
					],
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: '10%',
						top: '10%',
						data: ['剩余可用', '已经使用']
					},
					series: [
						{
							name: 'CPU(c)',
							type: 'pie',
							radius: '50%',
							right: "35%",
							center: ['50%', '50%'],
							data: [
								{value: this.nodeInfo.totalCpu - this.nodeInfo.usableCpu, name: '已经使用'},
								{value: this.nodeInfo.usableCpu, name: '剩余可用'}
							],
							color: ['#909399', '#67C23A'],
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						},
						{
							name: 'Memory(MB)',
							type: 'pie',
							radius: '50%',
							left: '35%',
							center: ['50%', '50%'],
							data: [
								{value: this.nodeInfo.totalMemory - this.nodeInfo.usableMemory, name: '已经使用'},
								{value: this.nodeInfo.usableMemory, name: '剩余可用'}
							],
							color: ['#909399', '#67C23A'],
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						}
					]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			},
			deletePodFun(row) {
				this.deletePod = true;
				this.row = row;
			},
			deletePodFun2() {
				deletePod(this.row.metadata.namespace,this.row.metadata.name).then(res=>{
					console.log(res)
					this.row = {}
					this.$router.go(0)
				})
				this.deletePod = false
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

    .info-left {
        width: 30%;
        display: inline-block;
        margin-top: 20px;
        margin-left: 20px;
        margin-bottom: 20px;
    }

    .info-box {
        display: inline-block;
        float: right;
        width: 60%;
    }

    .title {
        font-size: 18px;
        font-weight: bold;
        line-height: 30px;
        text-align: left;
        margin: 10px 20px 0;
    }

    .el-form-item {
        margin-bottom: 0;
    }

    .box {
        height: 400px;
        width: 100%;
        margin: 0 auto;
    }

</style>