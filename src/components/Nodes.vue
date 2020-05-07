<template>
    <div id="pro_form" style="position: relative;width: 100%;height: 1000px;">
        <div style="position: relative;width: auto">
            <el-row>
                <el-col :span="5" v-for="node in nodes" :key="node.name" :offset="1">
                    <el-tooltip class="item" effect="dark" content="此节点将从集群中被卸载" placement="top-start">
                        <el-button style="float: right; padding: 3px 0;color: #F56C6C;font-size: 18px" type="text"
                                   @click="deleteNodeFun(node.hostname)">
                            <span class="el-icon-close"></span></el-button>
                    </el-tooltip>
                    <el-card @click.native="toNode(node.hostname)" shadow="hover" style="width: 260px;height: 240px;">
                        <div class="title">
                            <span>{{node.hostname}}</span><span v-if="node.isMaster===1">(Master)</span>
                        </div>
                        <div class="div-hr"></div>
                        <div style="margin: 0 auto;width: 90%;">
                            <el-form label-width="100px" label-position="left">
                                <el-form-item label="节点名称:" style="text-align: left">
                                    {{node.hostname}}
                                </el-form-item>
                                <el-form-item label="节点地址:" style="text-align: left">
                                    {{node.address}}
                                </el-form-item>
                                <el-form-item label="Cpu总量(c):" style="text-align: left">
                                    {{node.totalCpu}}
                                </el-form-item>
                                <el-form-item label="内存总量(M):" style="text-align: left">
                                    {{node.totalMemory}}
                                </el-form-item>
                            </el-form>

                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog title="提示"
                       :visible.sync="deleteNode"
                       width="30%">
                <span>这是一段信息</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteNode = false">取 消</el-button>
                    <el-button type="primary" @click="deleteNodeFun2">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>

</template>

<script>
	import {cluster, nodes, deleteNode} from "../axios/apis";

	export default {
		name: "Nodes",
		data() {
			return {
				currentDate: 1000000,
				nodes: [
					{
						address: "",
						hostname: "",
						osImage: "",
						restCpu: 0,
						restMemory: 0,
						totalCpu: 0,
						totalMemory: 0,
						usableCpu: 0,
						usableMemory: 0
					}
				],
				deleteNode: false,
				deleteHostname: ""
			}
		},
		mounted() {
			nodes(null).then(res => {
				for (let i = 0; i < res.length; i++) {
					res[i].totalMemory = Math.round(res[i].totalMemory / 1024 / 1024)
					res[i].restMemory = Math.round(res[i].restMemory / 1024 / 1024)
					res[i].usableMemory = Math.round(res[i].usableMemory / 1024 / 1024)
				}

				this.nodes = res
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
			toNode(hostname) {
				this.$router.push({path: 'node', query: {hostname: hostname}})
			},
			deleteNodeFun(hostname) {
				this.deleteNode = true
				this.deleteHostname = hostname
			},
			deleteNodeFun2() {
				deleteNode(this.deleteHostname, null).then(res => {
					console.log(res)
				})
				this.deleteNode = false
				this.deleteHostname = ""
				this.$router.go(0)
			}
		}
	}
</script>

<style scoped>
    ul {
        padding-left: 0;
        margin: 16px auto;
    }

    ul li {
        list-style-type: none;
        text-align: left;
        line-height: 30px;
    }

    .title {
        margin: 10px 0;
        line-height: 20px;
    }

    .title span {
        font-weight: bold;
        font-size: 20px;
    }

    .div-hr {
        height: 1px;
        width: 90%;
        margin: 0 auto;
        background-color: #409EFF;
    }

    .box-card {
        width: 480px;
    }

    .el-form-item {
        margin-bottom: 0;
    }

</style>