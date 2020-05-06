<template>
    <div id="pro_form" style="position: relative;width: 100%;height: 1000px;">
        <div style="position: relative;width: auto">
            <el-row>
                <el-col :span="5" v-for="node in nodes" :key="node.name" :offset="1">
                    <el-card @click.native="toNode(node.hostname)" shadow="hover" style="width: 260px;height: 240px;">
                        <div class="title">
                            <span>{{node.hostname}}</span>
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
        </div>
    </div>

</template>

<script>
	import {nodes} from "../router/apis";

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
				]
			}
		},
		mounted() {
			nodes(null).then(res => {
				for (let i=0;i<res.length;i++){
					res[i].totalMemory=Math.round(res[i].totalMemory/1024/1024)
					res[i].restMemory=Math.round(res[i].restMemory/1024/1024)
					res[i].usableMemory=Math.round(res[i].usableMemory/1024/1024)
                }

				this.nodes = res
			})
		},
		methods: {
			toNode(hostname) {
				this.$router.push({path: 'node', query: {hostname: hostname}})
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

    .el-form-item{
        margin-bottom: 0;
    }

</style>