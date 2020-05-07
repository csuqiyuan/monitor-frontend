<template>
    <el-header style="height: 50px; background-color: #409EFF">
        <div class="header-left">
            <router-link to="/"><span style="text-decoration: none">管理系统</span></router-link>
        </div>
        <div class="header-right">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <i class="el-icon-more" style="color: #fff;font-size: 20px"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="addCluster = true">添加集群</span></el-dropdown-item>
                    <el-dropdown-item><span @click="addNode = true">添加新节点</span></el-dropdown-item>
                    <el-dropdown-item><span @click="exitCluster = true">退出此集群</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dialog title="添加已有集群(请输入集群主节点信息)" :visible.sync="addCluster">
                <div style="width: 70%;margin: 0 auto;">
                    <el-form :model="cluster">
                        <el-form-item label="节点IP: " :label-width="formLabelWidth">
                            <el-input v-model="cluster.hostname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="普通用户名: " :label-width="formLabelWidth">
                            <el-input v-model="cluster.username" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码: " :label-width="formLabelWidth">
                            <el-input v-model="cluster.password" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Root用户名: " :label-width="formLabelWidth">
                            <el-input v-model="cluster.rootName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Root密码: " :label-width="formLabelWidth">
                            <el-input v-model="cluster.rootPassword" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addCluster = false">取 消</el-button>
                    <el-button type="primary" @click="addClusterFun">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="添加新节点(首个节点必须是主节点)" :visible.sync="addNode">
                <div style="width: 70%;margin: 0 auto;">
                    <el-form :model="node">
                        <el-form-item label="节点IP: " :label-width="formLabelWidth">
                            <el-input v-model="node.hostname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="普通用户名: " :label-width="formLabelWidth">
                            <el-input v-model="node.username" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码: " :label-width="formLabelWidth">
                            <el-input v-model="node.password" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Root用户名: " :label-width="formLabelWidth">
                            <el-input v-model="node.rootName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Root密码: " :label-width="formLabelWidth">
                            <el-input v-model="node.rootPassword" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="是否为主节点: " :label-width="formLabelWidth">
                            <template>
                                <el-radio v-model="node.isMaster" label="1">是</el-radio>
                                <el-radio v-model="node.isMaster" label="0">否</el-radio>
                            </template>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addNode = false">取 消</el-button>
                    <el-button :plain="true" type="primary" @click="addNodeFun">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="退出此集群" :visible.sync="exitCluster">
                <div style="font-weight: bold;font-size: 18px;">是否确定退出此集群？（仅从此平台上下线，集群不会被卸载）</div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="exitCluster = false">取 消</el-button>
                    <el-button type="primary" @click="exitClusterFun">确 定</el-button>
                </div>
            </el-dialog>
        </div>

    </el-header>
</template>

<script>
	import {getCluster, exitCluster, createMaster, createNode} from "../axios/apis";

	export default {
		name: "Header",
		data() {
			return {
				addCluster: false,
				addNode: false,
				exitCluster: false,
				cluster: {
					hostname: '',
					username: '',
					password: '',
					rootName: '',
					rootPassword: '',
					isMaster: 1,
				},
				node: {
					hostname: '',
					username: '',
					password: '',
					rootName: '',
					rootPassword: '',
					isMaster: 1,
				},
				formLabelWidth: '150px'
			}
		},
		methods: {
			addClusterFun() {
				console.log(this.cluster)
				getCluster(this.cluster).then(res => {
					console.log(res)
				})
				this.addCluster = false
				this.$router.replace("/")
				this.$router.go(0)
			},
			addNodeFun() {
				this.$message('这可能需要几分钟时间，请稍等...');
				if (this.node.isMaster === 1) {
					createMaster(this.node).then(res => {
						console.log(res)
						this.$message({
							message: '恭喜你，添加成功',
							type: 'success'
						});
						this.$router.go(0)
					})
				} else {
					createNode(this.node).then(res => {
						console.log(res)
						this.$message({
							message: '恭喜你，添加成功',
							type: 'success'
						});
						this.$router.go(0)
					})
				}
				this.addNode = false
			},
			exitClusterFun() {
				exitCluster(null).then(res => {
					console.log(res)
				})
				this.exitCluster = false
				this.$router.replace("/404")
			}
		}
	}
</script>

<style scoped>

    .header-left {
        display: inline;
        float: left;
        width: auto;
        padding-left: 20px;
        line-height: 50px;
        text-align: center;
        vertical-align: middle;
    }

    .header-left span {
        color: #fff;
        font-size: 20px;
    }

    .header-right {
        display: inline;
        vertical-align: middle;
        text-align: center;
        line-height: 50px;
        float: right;
        width: auto;
        margin-right: 20px;
    }

    a {
        text-decoration: none;
        color: #409EFF;
    }

    .el-dropdown-link {
        cursor: pointer;
    }

</style>