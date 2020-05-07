<template>
    <div style="padding-top: 1px;">
        <div class="info">
            <div style="text-align: right;margin-top: 20px;margin-right: 40px;margin-bottom: 20px;">
                <el-button @click="add" type="primary" size="mini">添加</el-button>
            </div>
            <div>
                <el-dialog title="添加命名空间" :visible.sync="addNamespace">
                    <div style="width: 70%;margin: 0 auto;">
                        <el-form :model="namespace">
                            <el-form-item label="命名空间名: " :label-width="formLabelWidth">
                                <el-input v-model="namespace.metadata.name" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addNamespace = false">取 消</el-button>
                        <el-button :plain="true" type="primary" @click="addNamespaceFun">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <el-table
                    :data="namespaces"
                    style="width: 95%;margin: 0 auto 20px;"
                    max-height="500">
                <el-table-column
                        prop="metadata.name"
                        label="名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="status.phase"
                        label="状态"
                        width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status.phase==='Active'"
                              style="color:#67C23A;font-weight: bold;">{{scope.row.status.phase}}</span>
                        <span v-else style="color: #F56C6C;font-weight: bold;">{{scope.row.status.phase}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="150">
                    <template slot-scope="scope">
                        <el-button @click="deleteNamespaceFun(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="提示"
                       :visible.sync="deleteNamespace"
                       width="30%">
                <span>确定删除命名空间 {{deleteNamespaceName}} ?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteNamespace = false">取 消</el-button>
                    <el-button type="primary" @click="deleteNamespaceFun2">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
	import {cluster, namespace, namespaces, deleteNamespace} from "../axios/apis";

	export default {
		name: "Namespaces",
		data() {
			return {
				namespaces: [],
				formLabelWidth: '150px',
				addNamespace: false,
				namespace: {
					apiVersion: "v1",
					kind: "Namespace",
					metadata: {
						name: ""
					}
				},
				deleteNamespace: false,
				deleteNamespaceName: ""
			}
		},
		mounted() {
			namespaces(null).then(res => {
				for (let i = 0; i < res.items.length; i++) {
					let d = new Date(res.items[i].metadata.creationTimestamp)
					res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
						+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
						+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
				}
				this.namespaces = res.items
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
			handleClick(row) {
				console.log(row);
			},
			add() {
				this.addNamespace = true
			},
			addNamespaceFun() {
				namespace(this.namespace).then(res => {
					console.log(res)
					this.$router.go(0)
				})
			},
			deleteNamespaceFun(row) {
				console.log(row)
				this.deleteNamespaceName = row.metadata.name
				this.deleteNamespace = true
			},
			deleteNamespaceFun2() {
				deleteNamespace(this.deleteNamespaceName, null).then(res => {
					console.log(res)
					this.deleteNamespaceName = ""
					this.$router.go(0)
				})
				this.deleteNamespace = false
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